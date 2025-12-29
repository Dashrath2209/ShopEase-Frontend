# ShopEase - E-Commerce Platform

A production-ready, full-stack e-commerce application built with Spring Boot and React.js, featuring secure authentication, comprehensive product management, and seamless shopping experience.

## 🌐 Live Demo
**Frontend:** [https://shop-ease-pied.vercel.app](https://shop-ease-pied.vercel.app)

## 📸 Screenshots

### 🏠 Home Page
![ShopEase Homepage](./screenshots/homepage.png)
*Hero section with category navigation and search functionality*

### 🛍️ Products Page
![Products Catalog](./screenshots/products-page.png)
*Product listing with advanced filters, sorting, and real-time search*

## ✨ Key Features

### Backend (Spring Boot)
- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **Role-Based Access Control** - Admin and User roles
- 📦 **Product Management** - Complete CRUD operations
- 🛒 **Shopping Cart System** - Add, update, remove items
- 📋 **Order Management** - Order creation, tracking, and history
- 💾 **MySQL Integration** - Robust relational database
- 🔄 **Hibernate ORM** - Efficient data persistence
- 📚 **Swagger API Documentation** - Interactive API testing
- 🏗️ **Microservices Architecture** - Scalable and modular design
- ⚡ **RESTful APIs** - Clean and efficient endpoints

### Frontend (React.js)
- 🎨 **Responsive Design** - Mobile-first approach
- 🔍 **Smart Search** - Real-time product search
- 🏷️ **Category Filtering** - Browse by Electronics, Clothing, Books, etc.
- 💰 **Price Range Filter** - Min/Max price filtering
- ⭐ **Product Ratings** - Star-based rating system
- 🛒 **Shopping Cart** - Persistent cart with quantity management
- 👤 **User Dashboard** - Profile and order management
- 🎯 **Stock Indicators** - Real-time inventory status
- 📱 **Smooth Navigation** - Intuitive user experience

## 🛠️ Tech Stack

### Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)

## 📂 Project Structure
```
shopease-ecommerce/
├── backend/                      # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/shopease/
│   │   │   │       ├── config/          # Security & DB config
│   │   │   │       ├── controller/      # REST Controllers
│   │   │   │       ├── model/           # Entity Models
│   │   │   │       ├── repository/      # JPA Repositories
│   │   │   │       ├── service/         # Business Logic
│   │   │   │       └── security/        # JWT Implementation
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── frontend/                     # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable Components
│   │   ├── pages/               # Page Components
│   │   ├── services/            # API Services
│   │   ├── utils/               # Helper Functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── screenshots/                  # Application Screenshots
├── database/                     # SQL Scripts
│   └── schema.sql
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Java 11 or higher
- Node.js 14+ and npm
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Dashrath2209/shopease-ecommerce-fullstack.git
cd shopease-ecommerce-fullstack/backend
```

2. **Configure MySQL Database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE shopease_db;
```

3. **Update application.properties**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopease_db
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your_secret_key
```

4. **Build and Run**
```bash
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API endpoint**
```javascript
// src/config.js
export const API_BASE_URL = 'http://localhost:8080/api';
```

4. **Start development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

Access Swagger UI after starting the backend:
```
http://localhost:8080/swagger-ui.html
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

#### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{id}` - Remove item from cart

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details

## 🎯 Features in Detail

### Admin Panel
- Product inventory management
- Order processing and tracking
- User management
- Sales analytics

### User Features
- Secure registration and login
- Browse products by category
- Advanced search and filtering
- Add products to cart
- Checkout and order placement
- Order history tracking
- Profile management

### Product Catalog
- **10 Products Available** including:
  - iPhone 15 Pro ($999.99)
  - Wireless Mouse ($29.99)
  - Gaming Keyboard ($89.99)
  - Cotton T-Shirt
  - Jeans Blue
  - Spring Boot Guide
  - And more...

## 🔐 Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- Role-based access control (RBAC)
- CORS configuration
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Frontend (Vercel/AWS S3)
```bash
npm run build
# Deploy dist folder to Vercel or S3
```

### Backend (Options)
- AWS EC2
- Heroku
- Railway
- DigitalOcean

## 📊 Database Schema

Key entities:
- **User** - User accounts and profiles
- **Product** - Product catalog
- **Category** - Product categories
- **Cart** - Shopping cart items
- **Order** - Customer orders
- **OrderItem** - Order line items

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Real-time inventory updates
- [ ] Product recommendations using ML
- [ ] Social media integration

## 📝 Project Timeline

**Duration:** November 2025 - December 2025

## 👨‍💻 Author

**Dasharath Yadav**
- Software Engineer @ RUGR SIL Pvt Ltd
- LinkedIn: [@dasharath-yadav](https://www.linkedin.com/in/dasharath-yadav)
- GitHub: [@Dashrath2209](https://github.com/Dashrath2209)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot Documentation
- React.js Community
- MySQL Documentation
- JWT.io
- Swagger/OpenAPI

## 📞 Contact

For any queries or suggestions:
- Email: your.email@example.com
- LinkedIn: [Dasharath Yadav](https://www.linkedin.com/in/dasharath-yadav)

---

⭐ **Star this repo if you find it helpful!**

Made with ❤️ by Dasharath Yadav
```

## 🏷️ GitHub Topics to Add

Add these topics to your repository for better discoverability:
```
ecommerce
spring-boot
react
java
javascript
mysql
jwt-authentication
rest-api
hibernate
swagger
microservices
full-stack
nodejs
shopping-cart
product-catalog
