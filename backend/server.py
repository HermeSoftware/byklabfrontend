from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    subscription_plan: str = "Ücretsiz"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SubscriptionPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    price: int
    features: List[str]
    has_anatomy: bool
    has_video_swipe: bool

class Exercise(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    muscle_group: str
    difficulty: str
    duration: str
    description: str
    video_url: str
    thumbnail: str

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image: str
    author: str
    published_at: datetime
    read_time: str

class DashboardStats(BaseModel):
    total_workouts: int
    total_duration: str
    calories_burned: int
    muscle_balance: int
    weekly_progress: List[dict]

class PaymentRequest(BaseModel):
    plan_name: str
    card_number: str
    card_name: str
    expiry: str
    cvv: str

# Auth Endpoints
@api_router.post("/auth/signup", response_model=User)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        full_name=user_data.full_name
    )
    
    # Store hashed password separately (in real app)
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password_hash'] = pwd_context.hash(user_data.password)
    
    await db.users.insert_one(doc)
    return user

@api_router.post("/auth/login", response_model=User)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not pwd_context.verify(credentials.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Convert timestamp
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return User(**user)

# Subscription Endpoints
@api_router.get("/subscriptions/plans", response_model=List[SubscriptionPlan])
async def get_subscription_plans():
    plans = [
        SubscriptionPlan(
            id="free",
            name="Ücretsiz",
            price=0,
            features=["Blog erişimi", "Hakkımızda erişimi"],
            has_anatomy=False,
            has_video_swipe=False
        ),
        SubscriptionPlan(
            id="basic",
            name="Temel",
            price=100,
            features=["Egzersiz modülü", "Kas seçim sistemi", "Temel analizler"],
            has_anatomy=True,
            has_video_swipe=False
        ),
        SubscriptionPlan(
            id="advanced",
            name="Gelişmiş",
            price=300,
            features=["Video swipe modülü", "Detaylı analizler", "Dashboard erişimi", "Diyet planları"],
            has_anatomy=True,
            has_video_swipe=True
        ),
        SubscriptionPlan(
            id="comprehensive",
            name="Kapsamlı",
            price=500,
            features=["Tüm özellikler", "Kişisel antrenör desteği", "AI öneriler", "Öncelikli destek", "3D kas animasyonları"],
            has_anatomy=True,
            has_video_swipe=True
        )
    ]
    return plans

@api_router.post("/subscriptions/activate")
async def activate_subscription(payment: PaymentRequest):
    # Demo payment - always succeeds
    return {
        "success": True,
        "message": "Aboneliğiniz aktif hale geldi",
        "plan": payment.plan_name
    }

# Exercise Endpoints
@api_router.get("/exercises", response_model=List[Exercise])
async def get_exercises():
    exercises = await db.exercises.find({}, {"_id": 0}).to_list(100)
    return exercises

@api_router.get("/exercises/by-muscle/{muscle_group}", response_model=List[Exercise])
async def get_exercises_by_muscle(muscle_group: str):
    exercises = await db.exercises.find(
        {"muscle_group": muscle_group},
        {"_id": 0}
    ).to_list(50)
    return exercises

# Blog Endpoints
@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({}, {"_id": 0}).to_list(100)
    for post in posts:
        if isinstance(post['published_at'], str):
            post['published_at'] = datetime.fromisoformat(post['published_at'])
    return posts

@api_router.get("/blog/post/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if isinstance(post['published_at'], str):
        post['published_at'] = datetime.fromisoformat(post['published_at'])
    return BlogPost(**post)

# Dashboard Endpoints
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    return DashboardStats(
        total_workouts=42,
        total_duration="18.5 saat",
        calories_burned=8420,
        muscle_balance=87,
        weekly_progress=[
            {"day": "Pzt", "value": 65},
            {"day": "Sal", "value": 78},
            {"day": "Çar", "value": 82},
            {"day": "Per", "value": 71},
            {"day": "Cum", "value": 90},
            {"day": "Cmt", "value": 85},
            {"day": "Paz", "value": 73}
        ]
    )

# Seed data endpoint
@api_router.post("/seed-data")
async def seed_database():
    # Seed exercises
    exercises_data = [
        {
            "id": str(uuid.uuid4()),
            "name": "Bench Press",
            "muscle_group": "Göğüs",
            "difficulty": "Orta",
            "duration": "3x12",
            "description": "Göğüs kaslarını geliştiren temel hareket",
            "video_url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Deadlift",
            "muscle_group": "Sırt",
            "difficulty": "İleri",
            "duration": "4x8",
            "description": "Tüm vücudu çalıştıran compound hareket",
            "video_url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Squat",
            "muscle_group": "Bacak",
            "difficulty": "Orta",
            "duration": "4x10",
            "description": "Bacak kaslarını güçlendiren temel hareket",
            "video_url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Shoulder Press",
            "muscle_group": "Omuz",
            "difficulty": "Başlangıç",
            "duration": "3x15",
            "description": "Omuz kaslarını şekillendiren hareket",
            "video_url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Bicep Curl",
            "muscle_group": "Kol",
            "difficulty": "Başlangıç",
            "duration": "3x12",
            "description": "Biceps kaslarını geliştiren izolasyon hareketi",
            "video_url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Plank",
            "muscle_group": "Karın",
            "difficulty": "Başlangıç",
            "duration": "3x60sn",
            "description": "Core kaslarını güçlendiren statik hareket",
            "video_url": "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            "thumbnail": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"
        }
    ]
    
    await db.exercises.delete_many({})
    await db.exercises.insert_many(exercises_data)
    
    # Seed blog posts
    blog_posts = [
        {
            "id": str(uuid.uuid4()),
            "title": "Spor Biliminin Temelleri",
            "excerpt": "Modern spor bilimi nasıl çalışır? Biyomekanik, fizyoloji ve performans optimizasyonunun temellerini keşfedin.",
            "content": "# Spor Biliminin Temelleri\n\nSpor bilimi, atletik performansı optimize etmek için fizyoloji, biyomekanik, psikoloji ve beslenme bilimlerini birleştirir.\n\n## Biyomekanik Analiz\n\nHareket paternlerinin analizi, yaralanmaları önlemeye ve performansı artırmaya yardımcı olur.\n\n## Fizyolojik Adaptasyonlar\n\nDüzenli antrenman, kas liflerinde, kardiyovasküler sistemde ve sinir sisteminde adaptasyonlara yol açar.",
            "image": "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800",
            "author": "Dr. Ahmet Yılmaz",
            "published_at": datetime.now(timezone.utc).isoformat(),
            "read_time": "8 dakika"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Kas Aktivasyonu ve EMG Analizi",
            "excerpt": "Elektromiyografi (EMG) ile kas aktivasyonunu nasıl ölçüyoruz? Bilimsel yaklaşımlar ve pratik uygulamalar.",
            "content": "# Kas Aktivasyonu ve EMG Analizi\n\nEMG, kas kasılması sırasında üretilen elektriksel aktiviteyi ölçer.\n\n## Uygulama Alanları\n\n- Hareket analizi\n- Rehabilitasyon takibi\n- Antrenman optimizasyonu\n\n## Yorumlama\n\nEMG sinyalleri, hangi kasların ne zaman ve ne kadar aktif olduğunu gösterir.",
            "image": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
            "author": "Prof. Ayşe Demir",
            "published_at": datetime.now(timezone.utc).isoformat(),
            "read_time": "6 dakika"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Fizyoterapi ve Biyomekanik",
            "excerpt": "Yaralanma sonrası iyileşme sürecinde biyomekaniğin rolü nedir? Kanıta dayalı fizyoterapi yaklaşımları.",
            "content": "# Fizyoterapi ve Biyomekanik\n\nFizyoterapi, hareket bozukluklarını düzeltmek ve fonksiyonu restore etmek için biyomekanik prensipleri kullanır.\n\n## Hareket Analizi\n\nYanlış hareket paternleri tespit edilir ve düzeltilir.\n\n## Rehabilitasyon Protokolleri\n\nBilimsel kanıtlara dayalı, kademeli yükleme programları uygulanır.",
            "image": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800",
            "author": "Ft. Mehmet Kaya",
            "published_at": datetime.now(timezone.utc).isoformat(),
            "read_time": "10 dakika"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Performans Optimizasyonu",
            "excerpt": "Bilimsel yöntemlerle performansınızı nasıl maksimize edebilirsiniz? Data-driven antrenman yaklaşımları.",
            "content": "# Performans Optimizasyonu\n\nModern teknoloji ve bilimsel metotlar ile performans artışı sağlanabilir.\n\n## Veri Toplama\n\nGiyilebilir teknolojiler ve laboratuvar testleri ile objektif veriler elde edilir.\n\n## Analiz ve Uygulama\n\nVeriler analiz edilerek kişiye özel antrenman programları oluşturulur.",
            "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
            "author": "Dr. Zeynep Öztürk",
            "published_at": datetime.now(timezone.utc).isoformat(),
            "read_time": "7 dakika"
        }
    ]
    
    await db.blog_posts.delete_many({})
    await db.blog_posts.insert_many(blog_posts)
    
    return {"message": "Database seeded successfully"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()