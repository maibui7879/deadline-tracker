import axios from 'axios';
import { isDeadlineArray, type Deadline } from './deadlineTypes';

const API_URL = 'http://localhost:3001/deadlines';

const api = axios.create({ baseURL: 'http://localhost:3001', timeout: 4000 });

export const FALLBACK_DEADLINES: Deadline[] = [
  {
    id: '1',
    subject: 'Lập trình Web nâng cao',
    code: 'RIPT1411',
    title: 'Bài tập TH01 — Deadline Tracker (Redux Toolkit)',
    detail: 'đang làm',
    dueDate: '2026-10-03T23:59:00.000Z',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    subject: 'Phát triển phần mềm hướng dịch vụ',
    code: 'INT1448',
    title: 'Thiết kế kiến trúc microservices',
    detail: 'zzzzz',
    dueDate: '2026-10-04T23:59:00.000Z',
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    subject: 'Phân tích nghiệp vụ',
    code: 'RIPT1413',
    title: 'Vẽ sơ đồ use-case hệ thống bán hàng',
    detail: 'Bài tập chương 3',
    dueDate: '2026-10-07T23:59:00.000Z',
    priority: 'high',
    completed: false,
  },
  {
    id: '4',
    subject: 'Phát triển ứng dụng di động đa nền tảng',
    code: 'RIPT1412',
    title: 'Xây dựng màn hình đăng nhập',
    detail: 'Bài thực hành',
    dueDate: '2026-10-09T23:59:00.000Z',
    priority: 'medium',
    completed: false,
  },
  {
    id: '5',
    subject: 'Đảm bảo chất lượng phần mềm',
    code: 'INT1416',
    title: 'Viết test case kiểm thử hộp đen',
    detail: 'Bài nhóm',
    dueDate: '2026-10-12T23:59:00.000Z',
    priority: 'low',
    completed: false,
  },
  {
    id: '6',
    subject: 'Lịch sử Đảng Cộng sản Việt Nam',
    code: 'BAS1153',
    title: 'Làm slide quá trình đổi mới',
    detail: 'khò khò',
    dueDate: '2026-10-18T23:59:00.000Z',
    priority: 'medium',
    completed: false,
  },
  {
    id: '7',
    subject: 'Lập trình Web nâng cao',
    code: 'RIPT1411',
    title: 'Ôn TypeScript nâng cao (generic, utility types)',
    detail: 'Bài thực hành Tuần 5',
    dueDate: '2026-10-02T23:59:00.000Z',
    priority: 'low',
    completed: true,
  },
  {
    id: '8',
    subject: 'Phân tích nghiệp vụ',
    code: 'RIPT1413',
    title: 'Thuyết trình khảo sát yêu cầu khách hàng',
    detail: 'Bài nhóm · Nhóm 02',
    dueDate: '2026-10-05T23:59:00.000Z',
    priority: 'high',
    completed: true,
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const deadlineApi = {
  async fetchAll(): Promise<Deadline[]> {
    try {
      const res = await api.get<unknown>(API_URL);
      if (isDeadlineArray(res.data)) return res.data;
      console.warn('API trả về dữ liệu không hợp lệ, dùng fallback.');
      return FALLBACK_DEADLINES;
    } catch {
      await delay(500);
      return FALLBACK_DEADLINES;
    }
  },
};
