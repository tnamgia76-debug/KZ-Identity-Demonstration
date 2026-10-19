# Nhật ký đóng góp

Đối chiếu phân công từ ảnh chat và đầu ra ngày **2026-10-20**. Log này ghi phạm vi và sản phẩm có thể kiểm tra; không suy ra giờ làm, tỷ lệ đóng góp hoặc peer rating từ số commit.

| Thành viên | Phạm vi được giao | Sản phẩm và bằng chứng | Trạng thái |
|---|---|---|---|
| Nguyễn Hữu Anh — GitHub Huwxu-Anh | Research, trích nguồn và nội dung seminar | [Bản thảo report](docs/REPORT_VI.md), [Word report](docs/REPORT_VI.docx), [source register và claim matrix](docs/SOURCES.md), [demo snapshot index](docs/SNAPSHOTS.md), [log chạy lại off-chain](docs/evidence/local_rerun.json) | Bản thảo được chuẩn bị theo yêu cầu với hỗ trợ AI; chờ Nguyễn Hữu Anh đọc, kiểm chứng và duyệt để nhận hoàn thành phần nghiên cứu |

## Công việc có bằng chứng trong lần chuẩn bị này

- Đối chiếu mục 1, 3–5, Topic 5 và checklist mục 7 của handout; phân biệt yêu cầu chính thức với nội dung tư vấn trong ảnh chat.
- Dùng hai starter sources đúng chủ đề: Semaphore docs và paper Groth16; bổ sung đặc tả và code chính thức có phiên bản.
- Xây claim-to-source matrix; sửa cách diễn đạt public/private data, scope, nullifier, gas và proving time theo bằng chứng.
- Tổng hợp nội dung tiếng Việt, sơ đồ kiến trúc và 14 snapshot gốc có chú thích và thông tin xuất xứ.
- Chạy lại năm script off-chain, xác minh proof.json gốc, kiểm tra proof đổi scope và selector lỗi nullifier. Các thao tác tái chạy trong phiên hỗ trợ AI được ghi ở evidence; chưa phải tuyên bố Nguyễn Hữu Anh đã tự thực hiện độc lập.
- Ghi rõ các giới hạn của hợp đồng và phần chuẩn bị seminar còn cần hoàn tất.

## Ranh giới ghi nhận đóng góp

Demo và smart contract đã tồn tại trong commit `ee19f1d00f7ed9777d068ef965915d9d97830ed3`, trước thay đổi tài liệu này. Không ghi Nguyễn Hữu Anh là tác giả triển khai demo, deploy Sepolia hoặc tạo các screenshot gốc. Lịch sử repository trước đó ghi tài khoản `tnamgia76-debug`; log này không tự gán tài khoản đó cho một tên thành viên.

Ảnh chat giao Hải Đăng tổng hợp report sau khi nhận nội dung. Chưa có bằng chứng đầu ra hoặc xác nhận hoàn thành nên không ghi phần đó đã xong. Các thành viên còn lại bổ sung tên, việc đã làm và link bằng chứng trước khi nộp contribution log chung.

## Cách cập nhật sau khi đọc duyệt

Nguyễn Hữu Anh cập nhật trạng thái hàng của mình sau khi tự đọc nguồn, kiểm tra các claim và duyệt nội dung; có thể ghi commit hoặc review thể hiện những chỉnh sửa thực tế. Chỉ thêm thời gian làm việc hoặc tỷ lệ đóng góp khi nhóm có ghi nhận thật và thống nhất. Mọi thành viên cần có phần trình bày theo yêu cầu handout; log hiện chưa chứng minh buổi tập hoặc buổi trình bày đã diễn ra.
