# THESIEUTOC DISCORD BOT


### 1. Giới thiệu
Đây là một Discord bot dùng để xây dựng 1 currency, trong đó người dùng có thể nạp thẻ vào và sử dụng. Phiên bản này được code để có thể sử dụng mỗi server có 1 hệ thống tiền tệ riêng. Không liên quan lẫn nhau

### 2. Cách chạy
Sử dụng nodejs thông thường   
Yêu cầu: Cần có Nodejs version từ 12 trở lên, mysql database
Khuyến nghị: Kiểm tra source code để đảm bảo không có RAT


Bước 1: Download code về. Có thể sử dụng git clone để tăng sự tiện lợi  
Bước 2: Nhập các environment variable (xem tại mục 3)  
Bước 3: Sử dụng lệnh download thư viện về ``npm install``  
Bước 4: Tạo table serverinformation ( xem tại mục 4)
Bước 5: Sử dụng lệnh ``node index.js`` để khởi chạy

Hoàn toàn có thể sử dụng Docker. Khi này, bạn có thể thay đổi env trong Dockerfile và thay đổi mật khẩu database trong docker-compose.yml

### 3. Enviroment Variables
Sau đây là một số những variables cần thiết
|Tên|Chú thích giá trị|Ghi chú|
|:-|:-|:-|
|DATABASE_URL|URL để truy cập vào database||
|DISCORD_TOKEN|Token của Discord Bot||
|DISCORD_CLIENT_SECRET|Client Secret của Discord App|Optional|
|PORT|Port của web||
|HASH_KEY|Key để mã hóa|Có thể nhập bừa|

### 4. Database Table
Thông tin của server sẽ được lưu trong table ``server infomation``
```sql
CREATE TABLE `serverinfomation` (
  `serverID` varchar(45) NOT NULL,
  `serverRoles` varchar(45) DEFAULT NULL,
  `serverAPIkeys` varchar(45) DEFAULT NULL,
  `prefix` varchar(45) DEFAULT NULL,
  `logchanel` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`serverID`)
)
```
Ngoài ra, mỗi server còn sẽ có 1 table riêng để lưu thông tin về tiền của mỗi thành viên
```sql
CREATE TABLE s+Server_ID (
                ID varchar(255),
                Coin varchar(255)
)
```

### 5. Lisence
Bot được viết trên ``BSD 2-Clause License``. Các library mà bot sử dụng đều cho phép có thể sử dụng lisence này. Vui lòng dữ lại các credit của Moka Team khi có thay đổi
