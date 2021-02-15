import { createAction, createReducer, configureStore } from '@reduxjs/toolkit';
import {
  initialState,
  error,
  loading,
  added,
  canceled,
  done,
  tasksLoaded,
  workersLoaded,
  clearError,
  Task,
  Worker,
} from './reducer';
import thunkMiddleware from 'redux-thunk';

enum ActionType {
  ERROR = 'error',
  LOADING = 'loading',
  ADDED = 'added',
  DONE = 'done',
  CANCELED = 'canceled',
  TASKS_LOADED = 'tasksLoaded',
  WORKERS_LOADED = 'workersLoaded',
  CLEAR_ERROR = 'clearError',
}

export const errorAction = createAction<string | null>(ActionType.ERROR);
export const loadingAction = createAction(ActionType.LOADING);
export const addedAction = createAction<Task>(ActionType.ADDED);
export const doneAction = createAction<number>(ActionType.DONE);
export const canceledAction = createAction<number>(ActionType.CANCELED);
export const tasksLoadedAction = createAction<Task[]>(ActionType.TASKS_LOADED);
export const workersLoadedAction = createAction<Worker[]>(ActionType.WORKERS_LOADED);
export const clearErrorAction = createAction(ActionType.CLEAR_ERROR);

const reducer = createReducer(initialState, {
  [ActionType.ERROR]: error,
  [ActionType.LOADING]: clearError,
  [ActionType.ADDED]: loading,
  [ActionType.DONE]: done,
  [ActionType.CANCELED]: added,
  [ActionType.TASKS_LOADED]: canceled,
  [ActionType.WORKERS_LOADED]: workersLoaded,
  [ActionType.CLEAR_ERROR]: tasksLoaded,
});

export const store$ = configureStore({
  reducer,
  middleware: [thunkMiddleware],
});
