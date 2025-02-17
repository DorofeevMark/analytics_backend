import React from 'react';
import classNames from 'classnames';

import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";
import Scrollbars from "react-custom-scrollbars";

import Typography from "@material-ui/core/Typography";
import withStyles from '@material-ui/core/styles/withStyles';
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import Button from "@material-ui/core/Button";

import AddIcon from "@material-ui/icons/Add";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';

import {TopicsProps} from './types';
import {fields, workProgramSectionFields, workProgramTopicFields} from "../enum";
import {CourseFields} from "../../Courses/enum";

import ThemeCreateModal from "./ThemeCreateModal";
import ThemeMaterialCreateModal from "./ThemeMaterialCreateModal";

import connect from './Topics.connect';
import styles from './Topics.styles';

class Topics extends React.PureComponent<TopicsProps, any> {
    state = {
        showMaterial: {}
    }

    handleCreateNewTopic = () => {
        this.props.actions.openDialog({dialogType: fields.CREATE_NEW_TOPIC_DIALOG, data: {}});
    };

    handleCreateNewTopicOnSection = (sectionId: number) => () => {
        this.props.actions.openDialog({dialogType: fields.CREATE_NEW_TOPIC_DIALOG, data: {
            [workProgramTopicFields.SECTION]: sectionId
        }});
    };

    handleClickDelete = (id: string) => () => {
        this.props.actions.deleteTopic(id);
    };

    onSortEnd = (sectionIndex: number) => ({newIndex, oldIndex}: any) => {
        const {sections} = this.props;
        const currentSection = sections[sectionIndex];
        const sectionTopics = currentSection[workProgramSectionFields.TOPICS];
        const currentTopic = sectionTopics[oldIndex];

        this.props.actions.changeTopicNumber({topicId: currentTopic[workProgramTopicFields.ID], newNumber: newIndex + 1});
    }

    handleClickEdit = (topic: any) => () => {
        this.props.actions.openDialog({dialogType: fields.CREATE_NEW_TOPIC_DIALOG, data: topic});
    };

    handleClickAddMaterial = (topicId: number) => () => {
        this.props.actions.openDialog({dialogType: fields.ADD_NEW_MATERIAL_TO_TOPIC, data: {
            topicId: topicId
        }});
    };

    handleClickUpdateMaterial = (material: any, topicId: number) => () => {
        this.props.actions.openDialog({dialogType: fields.ADD_NEW_MATERIAL_TO_TOPIC, data: {
            ...material,
            topicId: topicId
        }});
    };

    handleClickDeleteMaterial = (materialId: any) => () => {
        this.props.actions.deleteTopicMaterial(materialId);
    };

    handleClickMaterial = (topicId: any) => () => {
        this.setState({
            showMaterial: {
                ...this.state.showMaterial,
                // @ts-ignore
                [topicId]: !this.state.showMaterial[topicId]
            }
        });
    };

    render() {
        const {classes, sections, isCanEdit} = this.props;
        const {showMaterial} = this.state;

        return (
            <div className={classes.topicsSection}>
                <Scrollbars style={{height: 'calc(100vh - 400px)'}}>
                    <div className={classes.topicsList}>
                    {sections.map((section, index) => (
                        <div key={`section-${section.id}`} className={classes.sectionItem}>
                            <Typography className={classes.sectionTitle}>
                                {section[workProgramSectionFields.ORDINAL_NUMBER]}. {section[workProgramSectionFields.NAME]}

                                {isCanEdit &&
                                    <Tooltip title="Добавить тему в данный раздел">
                                        <AddCircleIcon className={classes.sectionAddTopicIcon}
                                                       onClick={this.handleCreateNewTopicOnSection(section[workProgramSectionFields.ID])}
                                        />
                                    </Tooltip>
                                }
                            </Typography>

                            <div className={classes.topicsSectionList}>
                                {section[workProgramSectionFields.TOPICS].length === 0 &&
                                    <div>
                                        <div className={classes.topic}>
                                            <Typography className={classes.topicName}>
                                                В этом разделе пока не создано тем
                                            </Typography>
                                        </div>
                                    </div>
                                }
                                <SortableList section={section}
                                              useDragHandle={true}
                                              hideSortableGhost={false}
                                              onSortEnd={this.onSortEnd(index)}
                                              handleClickDelete={this.handleClickDelete}
                                              handleClickEdit={this.handleClickEdit}
                                              handleClickMaterial={this.handleClickMaterial}
                                              handleClickAddMaterial={this.handleClickAddMaterial}
                                              handleClickDeleteMaterial={this.handleClickDeleteMaterial}
                                              handleClickUpdateMaterial={this.handleClickUpdateMaterial}
                                              classes={classes}
                                              isCanEdit={isCanEdit}
                                              showMaterial={showMaterial}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                </Scrollbars>

                {isCanEdit &&
                    <Button color="secondary"
                         className={classes.addIcon}
                         onClick={this.handleCreateNewTopic}
                    >
                        <AddIcon/> Добавить тему
                    </Button>
                }

                <ThemeCreateModal />
                <ThemeMaterialCreateModal />
            </div>
        );
    }
}


const DragHandle = SortableHandle(() => <DragIndicatorIcon style={{cursor: "pointer"}}/>);

// @ts-ignore
const SortableItem = SortableElement(({topic, section, classes, handleClickDelete, handleClickEdit, isCanEdit, handleClickMaterial, showMaterial, handleClickAddMaterial, handleClickDeleteMaterial, handleClickUpdateMaterial}) => {
    const topicId = topic[workProgramTopicFields.ID];

    return <div className={classes.topic}>
        <div className={classes.topicItem}>
            {isCanEdit && <DragHandle />}

            <Typography className={classNames(classes.topicName, {[classes.bigTopicName]: !topic[workProgramTopicFields.COURSE]})}>
                {section[workProgramSectionFields.ORDINAL_NUMBER]}.
                {topic[workProgramTopicFields.NUMBER]}. {topic[workProgramTopicFields.DESCRIPTION]}
            </Typography>

            <div className={classes.onlineCourseItem}>
                {topic[workProgramTopicFields.COURSE] && <>
                    <Typography>Онлайн курс: &nbsp;
                        {/* eslint-disable-next-line*/}
                        <a target="_blank" href={topic[workProgramTopicFields.COURSE][CourseFields.COURSE_URL]} className={classes.link}>
                            <Typography> {topic[workProgramTopicFields.COURSE][CourseFields.TITLE]} </Typography>
                        </a>
                    </Typography>
                </>}
            </div>

            {isCanEdit ?
                <div className={classes.actions}>
                    <IconButton onClick={handleClickDelete(topic[workProgramTopicFields.ID])}>
                        <DeleteIcon/>
                    </IconButton>
                    <IconButton onClick={handleClickEdit(topic)}>
                        <EditIcon/>
                    </IconButton>
                    <Tooltip title="Материалы">
                        <IconButton onClick={handleClickMaterial(topicId)}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            : (
                <div className={classes.actions}>
                    <Tooltip title="Материалы">
                        <IconButton onClick={handleClickMaterial(topicId)}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </div>

        {showMaterial[topic[workProgramTopicFields.ID]] &&
            <div className={classes.materials}>
                <Typography> <b>Материалы:</b> </Typography>
                {topic[workProgramTopicFields.MATERIALS].map((material: any) =>
                    <Typography className={classes.materialItem} key={`material-${material[workProgramTopicFields.ID]}`}>
                        {material[workProgramTopicFields.MATERIAL_TITLE]}:&nbsp;&nbsp;<a href={material[workProgramTopicFields.MATERIAL_URL]}> ссылка </a>
                        {isCanEdit && <DeleteIcon className={classes.materialItemIcon} onClick={handleClickDeleteMaterial(material[workProgramTopicFields.ID])}/>}
                        {isCanEdit && <EditIcon className={classes.materialItemIcon} onClick={handleClickUpdateMaterial(material, topicId)} />}
                    </Typography>
                )}

                {isCanEdit && (
                    <Button size="small"
                            onClick={handleClickAddMaterial(topicId)}
                            className={classes.addMaterialButton}
                            variant="text"
                    >
                        Добавить материал
                    </Button>
                )}
            </div>
        }
    </div>
});

// @ts-ignore
const SortableList = SortableContainer(({section, classes, handleClickDelete, handleClickEdit, isCanEdit, handleClickMaterial, handleClickUpdateMaterial, handleClickDeleteMaterial, showMaterial, handleClickAddMaterial}) => {
    return (<div>
                {section[workProgramSectionFields.TOPICS].map((topic: any, index: number) =>
                    <SortableItem key={`item-${topic.id}`}
                                  index={index}
                                  topic={topic}
                                  section={section}
                                  classes={classes}
                                  handleClickDelete={handleClickDelete}
                                  handleClickEdit={handleClickEdit}
                                  handleClickMaterial={handleClickMaterial}
                                  isCanEdit={isCanEdit}
                                  showMaterial={showMaterial}
                                  handleClickAddMaterial={handleClickAddMaterial}
                                  handleClickDeleteMaterial={handleClickDeleteMaterial}
                                  handleClickUpdateMaterial={handleClickUpdateMaterial}
                    />
                )}
            </div>
    );
});


export default connect(withStyles(styles)(Topics));
