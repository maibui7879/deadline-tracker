import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { deadlineApi } from './deadlineApi';
import {
  type CreateDeadlineDto,
  type Deadline,
  type DeadlineFilter,
} from './deadlineTypes';
import type { AsyncStatus } from '../../types';

interface DeadlineState {
  items: Deadline[];
  status: AsyncStatus;
  error: string | null;
  filter: DeadlineFilter;
  search: string;
}

const initialState: DeadlineState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
  search: '',
};

export const fetchDeadlines = createAsyncThunk<Deadline[]>(
  'deadlines/fetchAll',
  async () => deadlineApi.fetchAll(),
);

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const deadlineSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    addDeadline: (state, action: PayloadAction<CreateDeadlineDto>) => {
      state.items.unshift({ ...action.payload, id: makeId(), completed: false });
    },
    toggleDeadline: (state, action: PayloadAction<string>) => {
      const found = state.items.find((d) => d.id === action.payload);
      if (found) found.completed = !found.completed;
    },
    deleteDeadline: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<DeadlineFilter>) => {
      state.filter = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDeadlines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Không tải được danh sách deadline.';
      });
  },
});

export const {
  addDeadline,
  toggleDeadline,
  deleteDeadline,
  setFilter,
  setSearch,
} = deadlineSlice.actions;

export default deadlineSlice.reducer;
