import requests
import sys
import json
from datetime import datetime

class BYKLabAPITester:
    def __init__(self, base_url="https://fitscience-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if success and response.content:
                try:
                    response_data = response.json()
                    details += f", Response: {json.dumps(response_data, indent=2)[:200]}..."
                except:
                    details += f", Response: {response.text[:100]}..."
            
            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication Endpoints...")
        
        # Test signup with unique email
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "full_name": "Test User",
            "email": f"test_{timestamp}@byklab.com",
            "password": "testpass123"
        }
        
        success, user_data = self.run_test(
            "User Signup",
            "POST",
            "api/auth/signup",
            200,
            data=test_user
        )
        
        if success:
            # Test login with same credentials
            login_success, login_data = self.run_test(
                "User Login",
                "POST", 
                "api/auth/login",
                200,
                data={"email": test_user["email"], "password": test_user["password"]}
            )
            return login_data if login_success else None
        
        return None

    def test_subscription_endpoints(self):
        """Test subscription-related endpoints"""
        print("\n💳 Testing Subscription Endpoints...")
        
        # Test get subscription plans
        self.run_test(
            "Get Subscription Plans",
            "GET",
            "api/subscriptions/plans",
            200
        )
        
        # Test activate subscription (demo payment)
        payment_data = {
            "plan_name": "Gelişmiş",
            "card_number": "1234567890123456",
            "card_name": "TEST USER",
            "expiry": "12/25",
            "cvv": "123"
        }
        
        self.run_test(
            "Activate Subscription (Demo Payment)",
            "POST",
            "api/subscriptions/activate",
            200,
            data=payment_data
        )

    def test_exercise_endpoints(self):
        """Test exercise-related endpoints"""
        print("\n💪 Testing Exercise Endpoints...")
        
        # Test get all exercises
        self.run_test(
            "Get All Exercises",
            "GET",
            "api/exercises",
            200
        )
        
        # Test get exercises by muscle group
        muscle_groups = ["Göğüs", "Sırt", "Bacak", "Omuz", "Kol", "Karın"]
        for muscle in muscle_groups:
            self.run_test(
                f"Get Exercises for {muscle}",
                "GET",
                f"api/exercises/by-muscle/{muscle}",
                200
            )

    def test_blog_endpoints(self):
        """Test blog-related endpoints"""
        print("\n📝 Testing Blog Endpoints...")
        
        # Test get all blog posts
        success, posts_data = self.run_test(
            "Get All Blog Posts",
            "GET",
            "api/blog/posts",
            200
        )
        
        # Test get individual blog post if posts exist
        if success and posts_data and len(posts_data) > 0:
            first_post_id = posts_data[0].get('id')
            if first_post_id:
                self.run_test(
                    "Get Individual Blog Post",
                    "GET",
                    f"api/blog/post/{first_post_id}",
                    200
                )

    def test_dashboard_endpoints(self):
        """Test dashboard-related endpoints"""
        print("\n📊 Testing Dashboard Endpoints...")
        
        # Test get dashboard stats
        self.run_test(
            "Get Dashboard Stats",
            "GET",
            "api/dashboard/stats",
            200
        )

    def test_seed_data(self):
        """Test database seeding"""
        print("\n🌱 Testing Database Seeding...")
        
        self.run_test(
            "Seed Database",
            "POST",
            "api/seed-data",
            200
        )

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("🚀 Starting BYK LAB API Tests...")
        print(f"Backend URL: {self.base_url}")
        
        # Seed database first
        self.test_seed_data()
        
        # Test authentication
        user_data = self.test_auth_endpoints()
        
        # Test other endpoints
        self.test_subscription_endpoints()
        self.test_exercise_endpoints()
        self.test_blog_endpoints()
        self.test_dashboard_endpoints()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = BYKLabAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed/tester.tests_run)*100 if tester.tests_run > 0 else 0
            },
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())