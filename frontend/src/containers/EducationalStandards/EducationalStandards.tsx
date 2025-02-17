import React from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
// @ts-ignore
import Scrollbars from "react-custom-scrollbars";

import classNames from 'classnames';
import {Link} from "react-router-dom";

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";

import withStyles from '@material-ui/core/styles/withStyles';

import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import EyeIcon from '@material-ui/icons/VisibilityOutlined';

import ConfirmDialog from "../../components/ConfirmDialog";
import SortingButton from "../../components/SortingButton";
import CreateModal from "./CreateModal";
import {SortingType} from "../../components/SortingButton/types";

import {EducationalStandardType} from './types';
import {EducationalStandardFields} from './enum';
import {EducationalStandardsProps} from "./types";

import connect from './EducationalStandards.connect';
import styles from './EducationalStandards.styles';
import Pagination from "@material-ui/lab/Pagination";
import {appRouter} from "../../service/router-service";
import {withRouter} from "react-router-dom";

class EducationalStandards extends React.Component<EducationalStandardsProps> {
    state = {
        deleteConfirmId: null
    }

    componentDidMount() {
        this.props.actions.getEducationalStandards();
    }

    handleClickDelete = (id: number) => () => {
        this.setState({
            deleteConfirmId: id
        });
    }

    handleConfirmDeleteDialog = () => {
        const {deleteConfirmId} = this.state;

        this.props.actions.deleteEducationalStandard(deleteConfirmId);
        this.closeConfirmDeleteDialog();
    }

    closeConfirmDeleteDialog = () => {
        this.setState({
            deleteConfirmId: null
        });
    }

    handleClickEdit = (educationalStandard: EducationalStandardType) => () => {
        this.props.actions.openDialog(educationalStandard);
    }

    handleCreate = () => {
        this.props.actions.openDialog();
    }

    handleChangeSearchQuery = (event: React.ChangeEvent) => {
        this.changeSearch(get(event, 'target.value', ''));
    }

    changeSearch = debounce((value: string): void => {
        this.props.actions.changeSearchQuery(value);
        this.props.actions.changeCurrentPage(1);
        this.props.actions.getEducationalStandards();
    }, 300);

    handleChangePage = (event: any, page: number) => {
        this.props.actions.changeCurrentPage(page + 1);
        this.props.actions.getEducationalStandards();
    }

    changeSorting = (field: string) => (mode: SortingType) => {
        this.props.actions.changeSorting({field: mode === '' ? '' : field, mode});
        this.props.actions.getEducationalStandards();
    }

    changeRoute = (id: any) => () => {
        //@ts-ignore
        this.props.history.push(appRouter.getEducationalStandardIDRoute(id))
    }

    render() {
        const {classes, educationalStandards, allCount, currentPage, sortingField, sortingMode} = this.props;
        const {deleteConfirmId} = this.state;

        return (
            <Paper className={classes.root}>
                <Typography className={classes.title}>
                    Образовательные стандарты

                    <TextField placeholder="Поиск"
                               variant="outlined"
                               InputProps={{
                                   classes: {
                                       root: classes.searchInput
                                   },
                                   startAdornment: <SearchOutlined/>,
                               }}
                               onChange={this.handleChangeSearchQuery}
                    />
                </Typography>

                <div className={classes.tableWrap}>
                    <div className={classNames(classes.row, classes.header)}>
                        <Typography className={classNames(classes.marginRight, classes.cell)}>
                            Название стандарта
                            <SortingButton changeMode={this.changeSorting(EducationalStandardFields.TITLE)}
                                           mode={sortingField === EducationalStandardFields.TITLE ? sortingMode : ''}
                            />
                        </Typography>


                        <Typography className={classNames(classes.marginRight, classes.cell)}>
                            Год
                            <SortingButton changeMode={this.changeSorting(EducationalStandardFields.YEAR)}
                                           mode={sortingField === EducationalStandardFields.YEAR ? sortingMode : ''}
                            />
                        </Typography>
                    </div>

                    <div className={classes.list}>
                        <Scrollbars>
                            {educationalStandards.map((educationalStandard: EducationalStandardType) =>
                                <div className={classes.row} key={educationalStandard[EducationalStandardFields.ID]}>
                                    <Typography className={classNames(classes.marginRight, classes.cell, classes.link)} >
                                        <Link to={appRouter.getEducationalStandardRoute(educationalStandard[EducationalStandardFields.ID])}>
                                            {educationalStandard[EducationalStandardFields.TITLE]}
                                        </Link>
                                    </Typography>
                                    <Typography
                                        className={classNames(classes.marginRight, classes.cell)}
                                        onClick={this.changeRoute(educationalStandard[EducationalStandardFields.ID])}
                                    >
                                        {educationalStandard[EducationalStandardFields.YEAR]}
                                    </Typography>
                                    <div className={classes.actions}>
                                        <IconButton>
                                            <Link style={{textDecoration: 'none', height: '23px', color: 'rgba(0, 0, 0, 0.54)'}}
                                                  to={appRouter.getEducationalStandardRoute(educationalStandard[EducationalStandardFields.ID])}>
                                                <EyeIcon />
                                            </Link>
                                        </IconButton>
                                        <IconButton
                                            onClick={this.handleClickDelete(educationalStandard[EducationalStandardFields.ID])}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton onClick={this.handleClickEdit(educationalStandard)}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            )}
                        </Scrollbars>
                    </div>
                </div>

                <div className={classes.footer}>
                    <Pagination count={Math.ceil(allCount / 10)}
                                page={currentPage}
                                onChange={this.handleChangePage}
                                color="primary"
                    />

                    <Fab color="secondary"
                         classes={{
                             root: classes.addIcon
                         }}
                         onClick={this.handleCreate}
                    >
                        <AddIcon/>
                    </Fab>
                </div>

                <CreateModal/>

                <ConfirmDialog onConfirm={this.handleConfirmDeleteDialog}
                               onDismiss={this.closeConfirmDeleteDialog}
                               confirmText={'Вы точно уверены, что хотите удалить образовательный стандарт?'}
                               isOpen={Boolean(deleteConfirmId)}
                               dialogTitle={'Удалить образовательный стандарт'}
                               confirmButtonText={'Удалить'}
                />
            </Paper>
        );
    }
}

// @ts-ignore
export default connect(withStyles(styles)(withRouter(EducationalStandards)));
