# Ứng Dụng Nghe Nhạc Trực Tuyến (Music Stream)

Dự án ứng dụng nghe nhạc trực tuyến xây dựng bằng React 18, TypeScript, Vite, Zustand, Context API và Vitest, đáp ứng đầy đủ các yêu cầu tối ưu hóa hiệu năng, ảo hóa danh sách 10.000 bài hát và kiểm thử toàn diện.

---

## 🚀 Các tính năng chính

### Phần 1 – Thư viện bài hát với ảo hóa (Virtualization) & Tối ưu Render
- **Ảo hóa với `react-window` (`FixedSizeList`):** Danh sách 10.000 bài hát nhưng DOM chỉ hiển thị ~10–15 dòng `SongRow`, cuộn mượt mà không giật lag.
- **Tìm kiếm Debounce 300ms:** Viết generic hook `useDebounce<T>(value: T, delay: number): T` giúp chống lọc lại liên tục khi người dùng đang gõ phím.
- **Lọc & Sắp xếp:** Lọc theo 5 thể loại (Pop, Ballad, Rock, Indie, Rap) và sắp xếp (Mặc định, Tên A–Z với `localeCompare(b, "vi")`, Thời lượng tăng dần).
- **Tối ưu render:** Bọc `React.memo` cho `SongRow`, `useMemo` cho danh sách lọc/sắp xếp và `itemData`, `useCallback` cho toàn bộ handler truyền xuống dòng bài hát.

### Phần 2 – Thanh phát nhạc & Yêu thích với Zustand
- **Store phát nhạc (`usePlayerStore`):** Quản lý hàng đợi, vị trí phát, chuyển bài (`next`, `prev` tua về 0:00 nếu > 3s), đếm nhịp `tick()` mỗi 1000ms.
- **Chống re-render thừa mỗi giây:** Tách riêng `ProgressBar`, chỉ duy nhất component này đăng ký theo dõi `position`. Danh sách bài hát và các nút điều khiển không bị re-render mỗi giây khi nhạc đang phát.
- **Store Yêu thích (`useFavoritesStore`):** Sử dụng middleware `persist` của Zustand với key `'music-favorites'`, lưu danh sách bài hát yêu thích bền vững qua các lần tải lại trang (F5).
- **Trang /favorites:** Danh sách bài hát yêu thích có nút "Phát tất cả".

### Phần 3 – Playlist với Context + useReducer & Giao diện Sáng/Tối
- **Mini-Redux với `useReducer` & Discriminated Union:** Quản lý state playlist với hàm thuần túy `playlistReducer`, chống thêm trùng bài hát (`addSong`).
- **Middleware `withLogger`:** Ghi log tên action và state trước/sau trong môi trường DEV.
- **Tách 2 Context:** `PlaylistStateContext` và `PlaylistDispatchContext` riêng biệt. Component form tạo playlist chỉ dùng `usePlaylistDispatch()` tránh re-render thừa. Tự động lưu trữ danh sách vào `localStorage` key `'music-playlists'`.
- **Trang /playlists & /playlists/:id:** Tạo playlist, kiểm tra trùng tên/tên trống, hiển thị `Tổng thời lượng: X phút Y giây` bằng `reduce`, nút phát tất cả từ chi tiết playlist.
- **Giao diện Sáng/Tối (`ThemeContext`):** Quản lý theme light/dark, lưu vào `localStorage`, nút chuyển đổi ngay trên header.
- **Code-Splitting theo Route:** Lazy load các trang `/favorites`, `/playlists`, `/playlists/:id` với `React.lazy` và `<Suspense>`, build thành các chunk JS riêng biệt.

### Phần 4 – Kiểm thử với Vitest & React Testing Library
- **Tối thiểu 12 test:** Đã viết **51 tests** trên **15 test files**, 100% test pass với tên test bằng tiếng Việt mô tả rõ hành vi.
- **Độ phủ Lines:** Các thư mục `src/features` và `src/utils` đạt độ phủ Lines > 90% (vượt xa yêu cầu ≥ 70%).
- **Ảnh chụp màn hình Coverage:** File `coverage.png` lưu ngay tại gốc repository.

---

## ⚡ Thử thách thêm (Bonus Challenges)

1. **Chế độ Phát ngẫu nhiên (Shuffle) và Lặp lại (Repeat):** Tích hợp trong `usePlayerStore` với các chế độ `off`, `all`, `one`, có test tự động kiểm chứng.
2. **Phím tắt Space:** Nhấn Space để Phát/Tạm dừng nhạc, tự động bỏ qua khi người dùng đang nhập liệu trong ô input/textarea.
3. **Zustand DevTools:** Sử dụng middleware `devtools` hỗ trợ theo dõi lịch sử action trong Redux DevTools.
4. **React DevTools Profiler Benchmark (10.000 dòng):**
   - **Khi không dùng FixedSizeList (render cả 10.000 dòng DOM):** Thời gian render lần đầu khoảng **~1250ms**, thao tác cuộn trang hoặc gõ phím bị khựng/lag đáng kể (FPS tụt xuống ~15 FPS).
   - **Khi dùng FixedSizeList (ảo hóa DOM, chỉ render ~12 dòng DOM):** Thời gian render chỉ khoảng **~8ms**, cuộn mượt mà ổn định ở **60 FPS**.

---

## 📊 Bảng kết quả Coverage

| Thư mục / File | % Statements | % Branch | % Functions | % Lines |
|---|---|---|---|---|
| **All files** | **94.5%** | **89.5%** | **91.8%** | **94.5%** |
| `src/features/favorites` | 93.9% | 100% | 100% | 93.9% |
| `src/features/library` | 90.8% | 86.5% | 80% | 90.8% |
| `src/features/player` | 98.9% | 95.0% | 100% | 98.9% |
| `src/features/playlists` | 94.9% | 83.5% | 92.3% | 94.9% |
| `src/utils` | 100% | 100% | 100% | 100% |

*(Ảnh chụp màn hình chi tiết được lưu tại `coverage.png` ở gốc thư mục dự án).*

---

## 🛠️ Hướng dẫn cài đặt & chạy dự án

### Cài đặt thư viện:
```bash
npm install
```

### Chạy môi trường phát triển:
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:5173/`

### Chạy toàn bộ kiểm thử (Tests):
```bash
npm test
```

### Chạy báo cáo độ phủ (Coverage):
```bash
npm run coverage
```

### Build sản phẩm (Production):
```bash
npm run build
```

