#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"partner@safar.tj","password":"Partner123!"}' | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

echo "Using token: ${TOKEN:0:30}..."

# Tour 1
curl -s -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Premium Umrah Package — 5 Star Luxury",
    "description": "Experience the most luxurious Umrah journey with 5-star hotel accommodation just 100m from Masjid al-Haram. Includes visa processing, round-trip flights from Dushanbe, daily breakfast and dinner, and a dedicated Tajik-speaking guide throughout the trip.",
    "departureCity": "Dushanbe",
    "price": 2800,
    "hotelStars": 5,
    "distanceToHaram": 0.1,
    "duration": 14,
    "imageUrl": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80"
  }' && echo ""

# Tour 2
curl -s -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Economy Umrah — Budget Friendly",
    "description": "A perfectly organized Umrah package designed for pilgrims on a budget. Stay at a comfortable 3-star hotel within 500m of Masjid al-Haram. All essential services included: visa, transport, and guided Umrah rituals.",
    "departureCity": "Dushanbe",
    "price": 1200,
    "hotelStars": 3,
    "distanceToHaram": 0.5,
    "duration": 10,
    "imageUrl": "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80"
  }' && echo ""

# Tour 3
curl -s -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Family Umrah — 4 Star Comfort",
    "description": "Designed specifically for families performing Umrah together. Spacious 4-star hotel rooms with family suites, kids-friendly facilities, and a dedicated family coordinator. Comfortable 21-day stay includes both Makkah and Madinah visits.",
    "departureCity": "Khujand",
    "price": 1950,
    "hotelStars": 4,
    "distanceToHaram": 0.3,
    "duration": 21,
    "imageUrl": "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80"
  }' && echo ""

# Tour 4
curl -s -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "VIP Umrah — Royal Experience",
    "description": "The ultimate VIP Umrah experience. Stay in a 5-star tower hotel with Kaaba view rooms. Personal concierge, private Quran teacher, business-class flights, and exclusive access to premium mosque areas. A once-in-a-lifetime spiritual journey.",
    "departureCity": "Dushanbe",
    "price": 4500,
    "hotelStars": 5,
    "distanceToHaram": 0.05,
    "duration": 14,
    "imageUrl": "https://images.unsplash.com/photo-1623073284804-d042d3a47c02?w=800&q=80"
  }' && echo ""

# Tour 5
curl -s -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Ramadan Umrah Special",
    "description": "Perform Umrah during the blessed month of Ramadan. Iftar and Suhoor meals are included at a 4-star hotel. Experience the incredible spiritual atmosphere of Ramadan in Makkah and Madinah. Limited spots available.",
    "departureCity": "Kulob",
    "price": 2200,
    "hotelStars": 4,
    "distanceToHaram": 0.2,
    "duration": 15,
    "imageUrl": "https://images.unsplash.com/photo-1614285750645-a432a6d14f5a?w=800&q=80"
  }' && echo ""

# Tour 6
curl -s -X POST http://localhost:3000/api/tours \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Standard Umrah + Madinah Ziyarat",
    "description": "A comprehensive Umrah package including a visit to Madinah and all major Islamic historical sites. 12 days in Makkah and 5 days in Madinah. Comfortable 3-star accommodation, all meals, and expert guided tours of Ziyarat places.",
    "departureCity": "Bokhtar",
    "price": 1600,
    "hotelStars": 3,
    "distanceToHaram": 0.4,
    "duration": 17,
    "imageUrl": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80"
  }' && echo ""

echo "All tours seeded!"
