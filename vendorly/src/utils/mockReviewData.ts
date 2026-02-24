import type { Review } from '../types'

export const mockReviews: Review[] = [
  {
    id: 'rev1',
    orderId: 'ORD001',
    customerId: 'customer1',
    vendorId: 'vendor1',
    productId: 'prod1',
    customerName: 'Rahul Sharma',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rahul',
    rating: 5,
    comment: 'Excellent quality vegetables! Fresh tomatoes and onions. The delivery was super fast, within 15 minutes. Will definitely order again.',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1582515073490-39981397c445?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 12,
    createdAt: '2024-01-14T10:30:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    vendorReply: {
      message: 'Thank you so much for your kind words! We always strive to provide the freshest vegetables. Your satisfaction means everything to us.',
      createdAt: '2024-01-14T15:45:00Z'
    }
  },
  {
    id: 'rev2',
    orderId: 'ORD002',
    customerId: 'customer2',
    vendorId: 'vendor1',
    customerName: 'Priya Patel',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',
    rating: 4,
    comment: 'Good quality products overall. The mangoes were sweet and ripe. However, delivery was slightly delayed due to traffic.',
    images: [],
    isVerified: true,
    helpfulCount: 8,
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  },
  {
    id: 'rev3',
    orderId: 'ORD003',
    customerId: 'customer3',
    vendorId: 'vendor2',
    productId: 'prod5',
    customerName: 'Amit Kumar',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=amit',
    rating: 5,
    comment: 'Amazing biryani! The rice was perfectly cooked and the chicken was tender. Packaging was also excellent, no spillage.',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03246963d4fe?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 15,
    createdAt: '2024-01-12T19:45:00Z',
    updatedAt: '2024-01-12T19:45:00Z',
    vendorReply: {
      message: 'Thank you for choosing us! We are delighted that you enjoyed our special biryani. Looking forward to serving you again.',
      createdAt: '2024-01-13T09:15:00Z'
    }
  },
  {
    id: 'rev4',
    orderId: 'ORD004',
    customerId: 'customer4',
    vendorId: 'vendor2',
    customerName: 'Sneha Singh',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sneha',
    rating: 3,
    comment: 'Food was okay, but could be better. The dal was a bit too salty for my taste. Service was quick though.',
    images: [],
    isVerified: true,
    helpfulCount: 3,
    createdAt: '2024-01-11T20:30:00Z',
    updatedAt: '2024-01-11T20:30:00Z'
  },
  {
    id: 'rev5',
    orderId: 'ORD005',
    customerId: 'customer5',
    vendorId: 'vendor3',
    productId: 'prod8',
    customerName: 'Kiran Reddy',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=kiran',
    rating: 5,
    comment: 'Perfect pharmacy service! Got my medicines on time and the pharmacist was very helpful in explaining the dosage.',
    images: [],
    isVerified: true,
    helpfulCount: 7,
    createdAt: '2024-01-10T16:15:00Z',
    updatedAt: '2024-01-10T16:15:00Z',
    vendorReply: {
      message: 'Thank you for trusting us with your healthcare needs. We are always here to help with any medical queries.',
      createdAt: '2024-01-10T18:00:00Z'
    }
  },
  {
    id: 'rev6',
    orderId: 'ORD006',
    customerId: 'customer6',
    vendorId: 'vendor4',
    customerName: 'Deepak Verma',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=deepak',
    rating: 4,
    comment: 'Great electronics store! The mobile charger I ordered was genuine and works perfectly. Fast delivery too.',
    images: [],
    isVerified: false,
    helpfulCount: 5,
    createdAt: '2024-01-09T11:45:00Z',
    updatedAt: '2024-01-09T11:45:00Z'
  },
  {
    id: 'rev7',
    orderId: 'ORD007',
    customerId: 'customer7',
    vendorId: 'vendor1',
    customerName: 'Anita Joshi',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=anita',
    rating: 2,
    comment: 'Not satisfied with the quality. The potatoes were not fresh and some vegetables were overripe. Expected better.',
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 2,
    createdAt: '2024-01-08T12:30:00Z',
    updatedAt: '2024-01-08T12:30:00Z',
    vendorReply: {
      message: 'We sincerely apologize for the poor quality. This is not our usual standard. Please contact us directly and we will make it right.',
      createdAt: '2024-01-08T14:20:00Z'
    }
  },
  {
    id: 'rev8',
    orderId: 'ORD008',
    customerId: 'customer8',
    vendorId: 'vendor2',
    customerName: 'Vikash Gupta',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=vikash',
    rating: 5,
    comment: 'Excellent home-style cooking! The rajma chawal reminded me of my mother\'s cooking. Will order again for sure.',
    images: [],
    isVerified: true,
    helpfulCount: 9,
    createdAt: '2024-01-07T13:15:00Z',
    updatedAt: '2024-01-07T13:15:00Z'
  },
  {
    id: 'rev9',
    orderId: 'ORD009',
    customerId: 'customer9',
    vendorId: 'vendor5',
    customerName: 'Ritu Sharma',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ritu',
    rating: 4,
    comment: 'Good collection of books and stationery. Found the exact notebook I was looking for. Staff was helpful.',
    images: [],
    isVerified: true,
    helpfulCount: 4,
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-06T10:00:00Z'
  },
  {
    id: 'rev10',
    orderId: 'ORD010',
    customerId: 'customer10',
    vendorId: 'vendor3',
    customerName: 'Sanjay Mehta',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sanjay',
    rating: 5,
    comment: 'Very professional pharmacy service. They have all the medicines in stock and provide proper consultation.',
    images: [],
    isVerified: true,
    helpfulCount: 11,
    createdAt: '2024-01-05T15:30:00Z',
    updatedAt: '2024-01-05T15:30:00Z'
  },
  {
    id: 'rev11',
    orderId: 'ORD011',
    customerId: 'customer11',
    vendorId: 'vendor6',
    productId: 'prod15',
    customerName: 'Neha Agarwal',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=neha',
    rating: 5,
    comment: 'Outstanding bakery items! The chocolate cake was moist and delicious. Perfect for my daughter\'s birthday party. Delivery was on time.',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 18,
    createdAt: '2024-01-15T18:20:00Z',
    updatedAt: '2024-01-15T18:20:00Z',
    vendorReply: {
      message: 'Thank you for choosing our bakery for your special occasion! We\'re thrilled to hear you loved our chocolate cake.',
      createdAt: '2024-01-15T20:10:00Z'
    }
  },
  {
    id: 'rev12',
    orderId: 'ORD012',
    customerId: 'customer12',
    vendorId: 'vendor7',
    productId: 'prod20',
    customerName: 'Manoj Tiwari',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=manoj',
    rating: 4,
    comment: 'Good variety of meat products. The chicken was fresh and well-packed. Price is reasonable compared to other stores in the area.',
    images: [],
    isVerified: true,
    helpfulCount: 6,
    createdAt: '2024-01-14T19:45:00Z',
    updatedAt: '2024-01-14T19:45:00Z'
  },
  {
    id: 'rev13',
    orderId: 'ORD013',
    customerId: 'customer13',
    vendorId: 'vendor8',
    productId: 'prod22',
    customerName: 'Pooja Nair',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=pooja',
    rating: 5,
    comment: 'Fantastic dairy products! Milk is always fresh and the paneer is amazing. Daily doorstep delivery saves so much time.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 14,
    createdAt: '2024-01-13T08:30:00Z',
    updatedAt: '2024-01-13T08:30:00Z',
    vendorReply: {
      message: 'Thank you for being our valued customer! We prioritize freshness in all our dairy products.',
      createdAt: '2024-01-13T10:15:00Z'
    }
  },
  {
    id: 'rev14',
    orderId: 'ORD014',
    customerId: 'customer14',
    vendorId: 'vendor1',
    productId: 'prod3',
    customerName: 'Rajesh Malhotra',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rajesh',
    rating: 3,
    comment: 'Average quality vegetables. Some items were okay but others seemed to be near expiry. Delivery person was polite though.',
    images: [],
    isVerified: true,
    helpfulCount: 4,
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-12T16:20:00Z'
  },
  {
    id: 'rev15',
    orderId: 'ORD015',
    customerId: 'customer15',
    vendorId: 'vendor2',
    productId: 'prod6',
    customerName: 'Sunita Desai',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sunita',
    rating: 2,
    comment: 'Disappointing food quality. The samosas were cold and the chutney tasted stale. Will not order again.',
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee02a9f78fe?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 1,
    createdAt: '2024-01-11T13:45:00Z',
    updatedAt: '2024-01-11T13:45:00Z',
    vendorReply: {
      message: 'We sincerely apologize for your experience. We take quality seriously and will investigate this matter immediately.',
      createdAt: '2024-01-11T15:30:00Z'
    }
  },
  {
    id: 'rev16',
    orderId: 'ORD016',
    customerId: 'customer16',
    vendorId: 'vendor3',
    productId: 'prod9',
    customerName: 'Vivek Iyer',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=vivek',
    rating: 4,
    comment: 'Quick prescription filling and knowledgeable staff. Prices are competitive and they offer generic alternatives too.',
    images: [],
    isVerified: true,
    helpfulCount: 9,
    createdAt: '2024-01-10T11:20:00Z',
    updatedAt: '2024-01-10T11:20:00Z'
  },
  {
    id: 'rev17',
    orderId: 'ORD017',
    customerId: 'customer17',
    vendorId: 'vendor4',
    productId: 'prod12',
    customerName: 'Kavya Menon',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=kavya',
    rating: 5,
    comment: 'Best electronics store in the area! Got my Bluetooth headphones at a great price. Installation was done professionally.',
    images: [],
    isVerified: true,
    helpfulCount: 16,
    createdAt: '2024-01-09T15:30:00Z',
    updatedAt: '2024-01-09T15:30:00Z'
  },
  {
    id: 'rev18',
    orderId: 'ORD018',
    customerId: 'customer18',
    vendorId: 'vendor5',
    productId: 'prod14',
    customerName: 'Ashok Kumar',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=ashok',
    rating: 3,
    comment: 'Decent selection of office supplies but prices seem a bit higher than market rates. Delivery was delayed by 30 minutes.',
    images: [],
    isVerified: false,
    helpfulCount: 2,
    createdAt: '2024-01-08T14:15:00Z',
    updatedAt: '2024-01-08T14:15:00Z'
  },
  {
    id: 'rev19',
    orderId: 'ORD019',
    customerId: 'customer19',
    vendorId: 'vendor6',
    productId: 'prod16',
    customerName: 'Divya Joshi',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=divya',
    rating: 5,
    comment: 'Incredible pastries and fresh bread! The croissants are bakery-fresh and buttery. Customer service is exceptional.',
    images: [
      'https://images.unsplash.com/photo-1603569283847-aa6f0c79a485?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 22,
    createdAt: '2024-01-07T09:00:00Z',
    updatedAt: '2024-01-07T09:00:00Z',
    vendorReply: {
      message: 'Thank you for your wonderful review! We pride ourselves on fresh baked goods every morning.',
      createdAt: '2024-01-07T11:00:00Z'
    }
  },
  {
    id: 'rev20',
    orderId: 'ORD020',
    customerId: 'customer20',
    vendorId: 'vendor7',
    productId: 'prod21',
    customerName: 'Arjun Singh',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=arjun',
    rating: 4,
    comment: 'Quality fish and seafood. The prawns were fresh and properly cleaned. Would recommend for special occasions.',
    images: [],
    isVerified: true,
    helpfulCount: 7,
    createdAt: '2024-01-06T17:45:00Z',
    updatedAt: '2024-01-06T17:45:00Z'
  },
  {
    id: 'rev21',
    orderId: 'ORD021',
    customerId: 'customer21',
    vendorId: 'vendor8',
    productId: 'prod23',
    customerName: 'Meera Pillai',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=meera',
    rating: 5,
    comment: 'Consistent quality dairy products. Their yogurt is the best in town and made with traditional methods. Love supporting local businesses!',
    images: [],
    isVerified: true,
    helpfulCount: 13,
    createdAt: '2024-01-05T10:15:00Z',
    updatedAt: '2024-01-05T10:15:00Z'
  },
  {
    id: 'rev22',
    orderId: 'ORD022',
    customerId: 'customer22',
    vendorId: 'vendor1',
    productId: 'prod4',
    customerName: 'Sachin Rao',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sachin',
    rating: 2,
    comment: 'Fruits were not as fresh as expected. The apples were soft and some bananas were overripe. Disappointed with the quality.',
    images: [
      'https://images.unsplash.com/photo-1570197788417-0e82cbafb664?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 3,
    createdAt: '2024-01-04T12:30:00Z',
    updatedAt: '2024-01-04T12:30:00Z',
    vendorReply: {
      message: 'We apologize for the inconvenience. Quality is our top priority and we will ensure better selection in the future.',
      createdAt: '2024-01-04T14:00:00Z'
    }
  },
  {
    id: 'rev23',
    orderId: 'ORD023',
    customerId: 'customer23',
    vendorId: 'vendor2',
    productId: 'prod7',
    customerName: 'Anjali Nair',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=anjali',
    rating: 4,
    comment: 'Delicious homemade meals! The pulao was aromatic and the raita was refreshing. Good portion size for the price.',
    images: [],
    isVerified: true,
    helpfulCount: 10,
    createdAt: '2024-01-03T20:10:00Z',
    updatedAt: '2024-01-03T20:10:00Z'
  },
  {
    id: 'rev24',
    orderId: 'ORD024',
    customerId: 'customer24',
    vendorId: 'vendor3',
    productId: 'prod10',
    customerName: 'Gaurav Sharma',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=gaurav',
    rating: 5,
    comment: 'Pharmacy exceeded expectations! They had rare medicines in stock and the consultant gave detailed advice about medication timing.',
    images: [],
    isVerified: true,
    helpfulCount: 19,
    createdAt: '2024-01-02T16:45:00Z',
    updatedAt: '2024-01-02T16:45:00Z',
    vendorReply: {
      message: 'Thank you for your trust. We maintain comprehensive stock and our pharmacists are always ready to assist.',
      createdAt: '2024-01-02T18:30:00Z'
    }
  },
  {
    id: 'rev25',
    orderId: 'ORD025',
    customerId: 'customer25',
    vendorId: 'vendor4',
    productId: 'prod13',
    customerName: 'Shilpa Reddy',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=shilpa',
    rating: 4,
    comment: 'Good electronics repair service. My laptop was fixed quickly and the technician explained what was wrong. Fair pricing.',
    images: [],
    isVerified: true,
    helpfulCount: 8,
    createdAt: '2024-01-01T14:20:00Z',
    updatedAt: '2024-01-01T14:20:00Z'
  },
  {
    id: 'rev26',
    orderId: 'ORD026',
    customerId: 'customer26',
    vendorId: 'vendor5',
    productId: 'prod17',
    customerName: 'Rohit Verma',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rohit',
    rating: 3,
    comment: 'Average bookstore experience. Had the book I needed but the store was cramped and staff was not very helpful.',
    images: [],
    isVerified: false,
    helpfulCount: 1,
    createdAt: '2023-12-31T11:30:00Z',
    updatedAt: '2023-12-31T11:30:00Z'
  },
  {
    id: 'rev27',
    orderId: 'ORD027',
    customerId: 'customer27',
    vendorId: 'vendor6',
    productId: 'prod18',
    customerName: 'Priyanka Chatterjee',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=priyanka',
    rating: 5,
    comment: 'Exceptional bakery service! Customized a beautiful wedding cake exactly as per our design. Guests loved it!',
    images: [
      'https://images.unsplash.com/photo-1559620194-7e4cde47b6ce?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 25,
    createdAt: '2023-12-30T19:00:00Z',
    updatedAt: '2023-12-30T19:00:00Z',
    vendorReply: {
      message: 'Thank you for letting us be part of your special day! It was our pleasure creating your dream cake.',
      createdAt: '2023-12-30T21:00:00Z'
    }
  },
  {
    id: 'rev28',
    orderId: 'ORD028',
    customerId: 'customer28',
    vendorId: 'vendor7',
    productId: 'prod24',
    customerName: 'Abhishek Patel',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=abhishek',
    rating: 4,
    comment: 'Fresh fish delivery is reliable. They provide good quality seafood and the fishmonger gives tips on preparation.',
    images: [],
    isVerified: true,
    helpfulCount: 11,
    createdAt: '2023-12-29T08:45:00Z',
    updatedAt: '2023-12-29T08:45:00Z'
  },
  {
    id: 'rev29',
    orderId: 'ORD029',
    customerId: 'customer29',
    vendorId: 'vendor8',
    productId: 'prod25',
    customerName: 'Tanvi Gupta',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=tanvi',
    rating: 5,
    comment: 'Love their organic milk and farm-fresh eggs. Delivery is always timely and products are packed well. Highly recommend!',
    images: [],
    isVerified: true,
    helpfulCount: 20,
    createdAt: '2023-12-28T10:30:00Z',
    updatedAt: '2023-12-28T10:30:00Z'
  },
  {
    id: 'rev30',
    orderId: 'ORD030',
    customerId: 'customer30',
    vendorId: 'vendor1',
    productId: 'prod2',
    customerName: 'Karan Mehta',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=karan',
    rating: 3,
    comment: 'Vegetables were okay but not as fresh as expected. The delivery timing was perfect though. Could improve on quality.',
    images: [
      'https://images.unsplash.com/photo-1569322606170-3ca63a5cc30f?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 5,
    createdAt: '2023-12-27T13:15:00Z',
    updatedAt: '2023-12-27T13:15:00Z'
  },
  {
    id: 'rev31',
    orderId: 'ORD031',
    customerId: 'customer31',
    vendorId: 'vendor2',
    productId: 'prod11',
    customerName: 'Nisha Kulkarni',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=nisha',
    rating: 5,
    comment: 'Best home-cooked food in the neighborhood! The chicken curry was flavorful and the rotis were soft. Packaging was eco-friendly too.',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 17,
    createdAt: '2023-12-26T19:30:00Z',
    updatedAt: '2023-12-26T19:30:00Z',
    vendorReply: {
      message: 'Thank you for your glowing review! We use family recipes and eco-friendly packaging for our valued customers.',
      createdAt: '2023-12-26T21:15:00Z'
    }
  },
  {
    id: 'rev32',
    orderId: 'ORD032',
    customerId: 'customer32',
    vendorId: 'vendor3',
    productId: 'prod11',
    customerName: 'Alok Pandey',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=alok',
    rating: 4,
    comment: 'Pharmacy has extended hours which is convenient. Staff is knowledgeable and prices are reasonable. Will continue ordering.',
    images: [],
    isVerified: true,
    helpfulCount: 6,
    createdAt: '2023-12-25T17:20:00Z',
    updatedAt: '2023-12-25T17:20:00Z'
  },
  {
    id: 'rev33',
    orderId: 'ORD033',
    customerId: 'customer33',
    vendorId: 'vendor4',
    productId: 'prod19',
    customerName: 'Rashmi Sharma',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rashmi',
    rating: 2,
    comment: 'Mobile repair took longer than promised and the cost was higher than initial estimate. Not satisfied with service.',
    images: [],
    isVerified: true,
    helpfulCount: 2,
    createdAt: '2023-12-24T15:10:00Z',
    updatedAt: '2023-12-24T15:10:00Z',
    vendorReply: {
      message: 'We apologize for the delay and cost discrepancy. We have noted your feedback and will improve our estimates.',
      createdAt: '2023-12-24T17:00:00Z'
    }
  },
  {
    id: 'rev34',
    orderId: 'ORD034',
    customerId: 'customer34',
    vendorId: 'vendor5',
    productId: 'prod18',
    customerName: 'Dinesh Nair',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=dinesh',
    rating: 5,
    comment: 'Found rare academic books that were out of print elsewhere. Store owner helped locate the exact edition needed. Excellent service!',
    images: [],
    isVerified: true,
    helpfulCount: 14,
    createdAt: '2023-12-23T12:45:00Z',
    updatedAt: '2023-12-23T12:45:00Z'
  },
  {
    id: 'rev35',
    orderId: 'ORD035',
    customerId: 'customer35',
    vendorId: 'vendor6',
    productId: 'prod19',
    customerName: 'Madhavi Iyer',
    customerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=madhavi',
    rating: 4,
    comment: 'Delicious cookies and cakes for kids. They also offer sugar-free options which is great for diabetic family members.',
    images: [
      'https://images.unsplash.com/photo-1509440159596-024902826274?w=300&h=300&fit=crop'
    ],
    isVerified: true,
    helpfulCount: 9,
    createdAt: '2023-12-22T16:30:00Z',
    updatedAt: '2023-12-22T16:30:00Z'
  }
]

// Helper functions for review analytics
export const getReviewStats = (reviews: Review[]) => {
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 
      : 0
  }))

  const recentReviews = reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
    recentReviews
  }
}

export const getVendorReviews = (vendorId: string) => {
  return mockReviews.filter(review => review.vendorId === vendorId)
}

export const getProductReviews = (productId: string) => {
  return mockReviews.filter(review => review.productId === productId)
}

export const getCustomerReviews = (customerId: string) => {
  return mockReviews.filter(review => review.customerId === customerId)
}