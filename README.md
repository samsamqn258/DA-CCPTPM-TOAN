# Hệ Thống Đặt Đồ Ăn Căn Tin Trường Hutech

## Mô tả
Hệ thống đặt đồ ăn căn tin trường Hutech được thiết kế nhằm cung cấp trải nghiệm tiện lợi và hiện đại cho người dùng, bao gồm các chức năng từ đặt món, thanh toán, đến quản lý sản phẩm và cửa hàng. Hệ thống tích hợp các tính năng thông minh như quét QR code để nhận món, khuyến mãi và phân hạng thành viên để gia tăng sự tiện lợi và gắn kết.

## Các chức năng chính

### 1. Đặt món
- Người dùng có thể xem danh sách món ăn, chọn món và thêm vào giỏ hàng.
- Hỗ trợ đặt nhiều món cùng lúc.

### 2. Thanh toán
- Hỗ trợ thanh toán trực tuyến qua ví điện tử (MoMo, ZaloPay, ...).
- Cung cấp hóa đơn chi tiết và mã số đơn hàng.

### 3. Thêm giỏ hàng
- Cho phép thêm các món ăn yêu thích vào giỏ hàng.
- Hiển thị tổng số tiền và số lượng món đã thêm.

### 4. Xem cửa hàng
- Hiển thị thông tin cửa hàng như tên, địa chỉ, giờ mở cửa.
- Người dùng có thể chọn cửa hàng gần nhất.

### 5. Đăng ký, đăng nhập
- Đăng ký tài khoản với email, số điện thoại.
- Đăng nhập bằng tài khoản đã tạo hoặc qua mạng xã hội.

### 6. Khuyến mãi
- Hiển thị các chương trình khuyến mãi hiện có.
- Áp dụng mã giảm giá khi thanh toán.

### 7. Đổi thưởng
- Hỗ trợ tích điểm sau mỗi lần mua hàng.
- Cho phép đổi điểm để nhận quà hoặc ưu đãi.

### 8. Phân hạng
- Hệ thống phân hạng thành viên (Bạc, Vàng, Kim Cương) dựa trên lịch sử mua hàng.
- Ưu đãi đặc biệt dành cho thành viên cấp cao.

### 9. Đăng xuất
- Người dùng có thể đăng xuất tài khoản một cách an toàn.

### 10. Nhận món bằng QR code
- Cung cấp mã QR sau khi thanh toán thành công.
- Người dùng quét mã QR tại quầy để nhận món.

### 11. Xác nhận món
- Xác nhận món ăn đã nhận thành công.
- Gửi phản hồi nếu có sự cố.

### 12. Thêm, xóa, sửa sản phẩm
- Quản trị viên có thể thêm mới, chỉnh sửa hoặc xóa món ăn trong hệ thống.

### 13. Quản lý kho
- Theo dõi số lượng nguyên liệu và sản phẩm còn trong kho.
- Cảnh báo khi nguyên liệu gần hết.

### 14. Quản lý cửa hàng
- Thêm, chỉnh sửa, xóa thông tin cửa hàng.
- Phân quyền quản lý từng cửa hàng.

### 15. Quản lý danh mục
- Quản lý danh mục món ăn như đồ uống, món chính, món ăn nhẹ.
- Thêm, xóa, chỉnh sửa danh mục.

### 16. Tìm kiếm
- Tìm kiếm món ăn hoặc cửa hàng bằng từ khóa.
- Gợi ý từ khóa phổ biến.

### 17. Yêu thích
- Cho phép người dùng đánh dấu các món ăn yêu thích.
- Hiển thị danh sách món ăn yêu thích để dễ dàng đặt lại.

## Công nghệ sử dụng
- **Frontend:**
  - ReactJS (Web).
  - React Native (Mobile).
- **Backend:** Node.js.
- **Cơ sở dữ liệu:** MongoDB.
- **Thanh toán:** Tích hợp API thanh toán MoMo.
- **Quản lý trạng thái:** Redux hoặc Context API.

## Hướng dẫn cài đặt

1. Clone repository:
   ```bash
   git clone <repository-url>
   ```

2. Cài đặt các dependencies:
   - **Frontend:**
     ```bash
     cd frontend
     npm install
     ```
   - **Mobile:**
     ```bash
     cd mobile
     npm install
     ```
   - **Backend:**
     ```bash
     cd backend
     npm install
     ```

3. Cấu hình môi trường:
   - Backend: Tạo file `.env` và cấu hình các thông số như database, API keys.
   - Frontend và Mobile: Cập nhật API endpoint trong file cấu hình.

4. Chạy ứng dụng:
   - **Frontend (ReactJS):**
     ```bash
     cd frontend
     npm start
     ```
   - **Mobile (React Native):**
     ```bash
     cd mobile
     npm start
     ```
   - **Backend (Node.js):**
     ```bash
     cd backend
     npm start
     ```

5. Truy cập ứng dụng:
   - Frontend: Truy cập tại `http://localhost:3000`.
   - Mobile: Chạy trên trình giả lập hoặc thiết bị thực.
   - Backend: Kiểm tra tại `http://localhost:<port>`.

## Đóng góp
Chúng tôi hoan nghênh các đóng góp từ cộng đồng. Vui lòng tạo pull request hoặc mở issue để đề xuất tính năng mới hoặc báo lỗi.

## Giấy phép
Dự án này được cấp phép theo [MIT License](LICENSE).

---

Cảm ơn bạn đã quan tâm đến hệ thống đặt đồ ăn căn tin trường Hutech. Hy vọng hệ thống này sẽ mang lại trải nghiệm tốt nhất cho người dùng!
