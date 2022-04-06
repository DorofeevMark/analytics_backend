export enum fields {
    PROFESSIONAL_STANDARD_LIST = 'PROFESSIONAL_STANDARD_LIST',
    PROFESSIONAL_STANDARD_DIALOG = 'PROFESSIONAL_STANDARD_DIALOG',
    IS_OPEN_DIALOG = 'IS_OPEN_DIALOG',
    DIALOG_DATA = 'DIALOG_DATA',
    SEARCH_QUERY = 'SEARCH_QUERY',
    CURRENT_PAGE = 'CURRENT_PAGE',
    ALL_COUNT = 'ALL_COUNT',
    SORTING = 'SORTING',
    SORTING_FIELD = 'SORTING_FIELD',
    SORTING_MODE = 'SORTING_MODE',
    PROFESSIONAL_STANDARD = 'PROFESSIONAL_STANDARD',
    LABOR_FUNCTIONS = 'LABOR_FUNCTIONS',
}

export enum fetchingTypes {
    GET_PROFESSIONAL_STANDARDS = 'GET_PROFESSIONAL_STANDARDS',
    DELETE_PROFESSIONAL_STANDARDS = 'DELETE_PROFESSIONAL_STANDARDS',
    UPDATE_PROFESSIONAL_STANDARDS = 'UPDATE_PROFESSIONAL_STANDARDS',
    CREATE_PROFESSIONAL_STANDARDS = 'CREATE_PROFESSIONAL_STANDARDS',
    CREATE_PROFESSIONAL_STANDARDS_LABOR_FUNCTION = 'CREATE_PROFESSIONAL_STANDARDS_LABOR_FUNCTION',
    EDIT_PROFESSIONAL_STANDARDS_LABOR_FUNCTION = 'EDIT_PROFESSIONAL_STANDARDS_LABOR_FUNCTION',
    DELETE_PROFESSIONAL_STANDARDS_LABOR_FUNCTION = 'DELETE_PROFESSIONAL_STANDARDS_LABOR_FUNCTION',
    GET_LABOR_FUNCTION = 'GET_LABOR_FUNCTION',
}

export enum ProfessionalStandardFields {
    ID = 'id',
    TITLE = 'title',
    NUMBER = 'code',
    CODE = 'code_of_prof_area',
    NAME = 'name_of_prof_area',
}
