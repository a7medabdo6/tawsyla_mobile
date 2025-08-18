import { images } from "@/constants";

// Export auth hooks
export * from "./useAuth";

export const userAddresses = [
  {
    id: "1",
    name: "Home",
    address: "364 Stillwater Ave, Attleboro, MA 02703",
  },
  {
    id: "2",
    name: "Office",
    address: "73 Virginia Rd, Cuyahoga Falls, OH 44221",
  },
  {
    id: "3",
    name: "Mall Plaza",
    address: "123 Main St, San Francisco, CA 94107",
  },
  {
    id: "4",
    name: "Garden Park",
    address: "600 Bloom St, Portland, OR 97201",
  },
  {
    id: "5",
    name: "Grand City Park",
    address: "26 State St Daphne, AL 36526",
  },
  {
    id: "6",
    name: "Town Square",
    address: "20 Applegate St. Hoboken, NJ 07030",
  },
  {
    id: "7",
    name: "Bank",
    address: "917 W Pine Street Easton, PA 0423",
  },
];

export const faqKeywords = [
  {
    id: "1",
    name: "عام",
  },
  {
    id: "2",
    name: "الحساب",
  },
  {
    id: "3",
    name: "الأمان",
  },
  {
    id: "4",
    name: "التتبع",
  },
  {
    id: "5",
    name: "مشكلات",
  },
  {
    id: "6",
    name: "الخدمات",
  },
];

export const faqs = [
  {
    question: "كيف يمكنني جدولة توصيل جديد؟",
    answer:
      'لجدولة توصيل جديد، قم بتسجيل الدخول إلى التطبيق، وانتقل إلى قسم "التوصيلات"، ثم اتبع التعليمات لإنشاء طلب توصيل جديد. ستحتاج إلى إدخال تفاصيل مواقع الاستلام والتسليم، بالإضافة إلى معلومات الطرد.',
    type: "الخدمات",
  },
  {
    question: "كيف يمكنني إعادة تعيين كلمة مرور حسابي؟",
    answer:
      'لإعادة تعيين كلمة مرور حسابك، انتقل إلى شاشة تسجيل الدخول واضغط على "نسيت كلمة المرور". اتبع التعليمات لإعادة تعيين كلمة المرور. قد يُطلب منك التحقق من هويتك باستخدام البريد الإلكتروني أو رقم الهاتف المسجل.',
    type: "الأمان",
  },
  {
    question: "ماذا أفعل إذا استلمت طردًا تالفًا؟",
    answer:
      'إذا استلمت طردًا تالفًا، تواصل فورًا مع دعم العملاء من خلال التطبيق. يمكنك أيضًا الإبلاغ عن المشكلة في قسم "الطلبات" لبدء عملية الاسترجاع أو الاسترداد.',
    type: "مشكلات",
  },
  {
    question: "كيف يمكنني تتبع طلبي؟",
    answer:
      'لتتبع طلبيتك، انتقل إلى قسم "تتبع" في التطبيق، وأدخل رقم التتبع الخاص بك، وستتمكن من رؤية الحالة الفعلية للطرد في الوقت الحقيقي.',
    type: "التتبع",
  },
  {
    question: "هل يمكنني تحديث عنوان التوصيل؟",
    answer:
      'نعم، يمكنك تحديث عنوان التوصيل قبل إرسال الطرد. انتقل إلى قسم "الطلبات"، وحدد الطلب الذي ترغب في تحديثه، ثم اتبع التعليمات لتغيير العنوان.',
    type: "الحساب",
  },
  {
    question: "كيف يمكنني تحديث معلومات الاتصال الخاصة بي؟",
    answer:
      "لتحديث معلومات الاتصال الخاصة بك، انتقل إلى إعدادات الحساب، وستجد خيارات لتعديل تفاصيل ملفك الشخصي مثل العنوان ورقم الهاتف والبريد الإلكتروني.",
    type: "الحساب",
  },
  {
    question: "ما مدى أمان معلوماتي في التطبيق؟",
    answer:
      "نحن نولي أمان معلوماتك أهمية قصوى. يستخدم تطبيقنا تشفيرًا متقدمًا وبروتوكولات أمان لحماية بياناتك الشخصية.",
    type: "الأمان",
  },
  {
    question: "كيف يمكنني عرض سجل توصيلاتي؟",
    answer:
      'لعرض سجل توصيلاتك، انتقل إلى قسم "الطلبات" في التطبيق. يمكنك تصفية الطلبات حسب التاريخ أو الحالة أو المستلم.',
    type: "التتبع",
  },
  {
    question: "ما هي أنواع خدمات التوصيل المتاحة؟",
    answer:
      'نحن نقدم مجموعة من خدمات التوصيل مثل التوصيل العادي، والتوصيل السريع، والتوصيل في نفس اليوم. قم بزيارة قسم "الخدمات" في التطبيق لمعرفة المزيد واختيار الخدمة التي تناسب احتياجاتك.',
    type: "الخدمات",
  },
  {
    question: "كيف يمكنني التواصل مع دعم العملاء؟",
    answer:
      'للتواصل مع دعم العملاء، انتقل إلى قسم "المساعدة" في التطبيق. يمكنك الوصول إلينا عبر الدردشة أو البريد الإلكتروني أو الهاتف. فريق الدعم متاح 24/7 لمساعدتك.',
    type: "عام",
  },
];

export const friends = [
  {
    id: "1",
    name: "Tynisa Obey",
    phoneNumber: "+1-300-400-0135",
    avatar: images.user1,
  },
  {
    id: "2",
    name: "Florencio Dorance",
    phoneNumber: "+1-309-900-0135",
    avatar: images.user2,
  },
  {
    id: "3",
    name: "Chantal Shelburne",
    phoneNumber: "+1-400-100-1009",
    avatar: images.user3,
  },
  {
    id: "4",
    name: "Maryland Winkles",
    phoneNumber: "+1-970-200-4550",
    avatar: images.user4,
  },
  {
    id: "5",
    name: "Rodolfo Goode",
    phoneNumber: "+1-100-200-9800",
    avatar: images.user5,
  },
  {
    id: "6",
    name: "Benny Spanbauer",
    phoneNumber: "+1-780-200-9800",
    avatar: images.user6,
  },
  {
    id: "7",
    name: "Tyra Dillon",
    phoneNumber: "+1-943-230-9899",
    avatar: images.user7,
  },
  {
    id: "8",
    name: "Jamel Eusobio",
    phoneNumber: "+1-900-234-9899",
    avatar: images.user8,
  },
  {
    id: "9",
    name: "Pedro Haurad",
    phoneNumber: "+1-240-234-9899",
    avatar: images.user9,
  },
  {
    id: "10",
    name: "Clinton Mcclure",
    phoneNumber: "+1-500-234-4555",
    avatar: images.user10,
  },
];

export const notifications = [
  {
    id: "1",
    title: "Security Updates!",
    description:
      "Our app now supports Two-Factor Authentication. Enable it now to make your account more secure.",
    date: "2024-06-04T04:52:06.501Z",
    time: "4:52 PM",
    type: "Security",
    isNew: true,
  },
  {
    id: "2",
    title: "New Delivery Options!",
    description:
      "We now offer multiple delivery options including express and same-day delivery. Try them out now.",
    date: "2024-06-04T04:52:06.501Z",
    time: "08:52 PM",
    type: "Services",
    isNew: true,
  },
  {
    id: "3",
    title: "App Update Available!",
    description:
      "Update our app now to get access to the latest features and improvements for a better delivery experience.",
    date: "2024-06-04T07:12:06.501Z",
    time: "07:12 AM",
    type: "Update",
    isNew: false,
  },
  {
    id: "4",
    title: "Delivery Scheduled!",
    description:
      "Your delivery has been successfully scheduled. Track your delivery for real-time updates.",
    date: "2024-06-04T11:14:06.501Z",
    time: "11:14 AM",
    type: "Delivery",
    isNew: false,
  },
  {
    id: "5",
    title: "Account Setup Successful!",
    description:
      "Your account creation is successful, you can now schedule and manage your deliveries.",
    date: "2024-06-03T08:39:06.501Z",
    time: "08:39 AM",
    type: "Account",
    isNew: false,
  },
  {
    id: "6",
    title: "Package Delivered!",
    description:
      "Your package has been successfully delivered. Check your delivery history for more details.",
    date: "2024-06-02T09:52:06.501Z",
    time: "09:52 AM",
    type: "Delivery",
    isNew: false,
  },
  {
    id: "7",
    title: "Scheduled Maintenance!",
    description:
      "Our app will undergo scheduled maintenance on June 10, 2024, from 02:00 AM to 04:00 AM.",
    date: "2024-06-01T03:22:06.501Z",
    time: "03:22 AM",
    type: "Account",
    isNew: false,
  },
  {
    id: "8",
    title: "New Pickup Locations!",
    description:
      "We now support new pickup locations in your area for your convenience.",
    date: "2024-05-30T06:15:06.501Z",
    time: "06:15 AM",
    type: "Services",
    isNew: false,
  },
  {
    id: "9",
    title: "Referral Bonus!",
    description:
      "Invite friends to use our app and earn up to $50 for each referral.",
    date: "2024-05-29T10:00:06.501Z",
    time: "10:00 AM",
    type: "Promotion",
    isNew: false,
  },
  {
    id: "10",
    title: "Password Change Successful!",
    description:
      "Your password has been changed successfully. If this was not you, please contact support immediately.",
    date: "2024-05-28T04:52:06.501Z",
    time: "04:52 AM",
    type: "Security",
    isNew: false,
  },
];

export const messsagesData = [
  {
    id: "1",
    fullName: "Jhon Smith",
    userImg: images.user1,
    lastSeen: "2023-11-16T04:52:06.501Z",
    lastMessage: "I love you. see you soon baby",
    messageInQueue: 2,
    lastMessageTime: "12:25 PM",
    isOnline: true,
  },
  {
    id: "2",
    fullName: "Anuska Sharma",
    userImg: images.user2,
    lastSeen: "2023-11-18T04:52:06.501Z",
    lastMessage: "I Know. you are so busy man.",
    messageInQueue: 0,
    lastMessageTime: "12:15 PM",
    isOnline: false,
  },
  {
    id: "3",
    fullName: "Virat Kohili",
    userImg: images.user3,
    lastSeen: "2023-11-20T04:52:06.501Z",
    lastMessage: "Ok, see u soon",
    messageInQueue: 0,
    lastMessageTime: "09:12 PM",
    isOnline: true,
  },
  {
    id: "4",
    fullName: "Shikhor Dhaon",
    userImg: images.user4,
    lastSeen: "2023-11-18T04:52:06.501Z",
    lastMessage: "Great! Do you Love it.",
    messageInQueue: 0,
    lastMessageTime: "04:12 PM",
    isOnline: true,
  },
  {
    id: "5",
    fullName: "Shakib Hasan",
    userImg: images.user5,
    lastSeen: "2023-11-21T04:52:06.501Z",
    lastMessage: "Thank you !",
    messageInQueue: 2,
    lastMessageTime: "10:30 AM",
    isOnline: true,
  },
  {
    id: "6",
    fullName: "Jacksoon",
    userImg: images.user6,
    lastSeen: "2023-11-20T04:52:06.501Z",
    lastMessage: "Do you want to go out dinner",
    messageInQueue: 3,
    lastMessageTime: "10:05 PM",
    isOnline: false,
  },
  {
    id: "7",
    fullName: "Tom Jerry",
    userImg: images.user7,
    lastSeen: "2023-11-20T04:52:06.501Z",
    lastMessage: "Do you want to go out dinner",
    messageInQueue: 2,
    lastMessageTime: "11:05 PM",
    isOnline: true,
  },
  {
    id: "8",
    fullName: "Lucky Luck",
    userImg: images.user8,
    lastSeen: "2023-11-20T04:52:06.501Z",
    lastMessage: "Can you share the design with me?",
    messageInQueue: 2,
    lastMessageTime: "09:11 PM",
    isOnline: true,
  },
  {
    id: "9",
    fullName: "Nate Jack",
    userImg: images.user9,
    lastSeen: "2023-11-20T04:52:06.501Z",
    lastMessage: "Tell me what you want?",
    messageInQueue: 0,
    lastMessageTime: "06:43 PM",
    isOnline: true,
  },
];

export const callData = [
  {
    id: "1",
    fullName: "Roselle Erhman",
    userImg: images.user10,
    status: "Incoming",
    date: "Dec 19, 2024",
  },
  {
    id: "2",
    fullName: "Willard Purnell",
    userImg: images.user9,
    status: "Outgoing",
    date: "Dec 17, 2024",
  },
  {
    id: "3",
    fullName: "Charlotte Hanlin",
    userImg: images.user8,
    status: "Missed",
    date: "Dec 16, 2024",
  },
  {
    id: "4",
    fullName: "Merlin Kevin",
    userImg: images.user7,
    status: "Missed",
    date: "Dec 16, 2024",
  },
  {
    id: "5",
    fullName: "Lavern Laboy",
    userImg: images.user6,
    status: "Outgoing",
    date: "Dec 16, 2024",
  },
  {
    id: "6",
    fullName: "Phyllis Godley",
    userImg: images.user5,
    status: "Incoming",
    date: "Dec 15, 2024",
  },
  {
    id: "7",
    fullName: "Tyra Dillon",
    userImg: images.user4,
    status: "Outgoing",
    date: "Dec 15, 2024",
  },
  {
    id: "8",
    fullName: "Marci Center",
    userImg: images.user3,
    status: "Missed",
    date: "Dec 15, 2024",
  },
  {
    id: "9",
    fullName: "Clinton Mccure",
    userImg: images.user2,
    status: "Outgoing",
    date: "Dec 15, 2024",
  },
];

export const transactionHistory = [
  {
    id: "1",
    title: "New Order Made!",
    description: "You have created a new shipping order",
    type: "Order",
    date: "2024-06-16T04:52:06.501Z",
  },
  {
    id: "2",
    title: "Top Up Successful!",
    description: "You successfully top up your e-wallet for $700",
    type: "Topup",
    date: "2024-06-15T04:52:06.501Z",
  },
  {
    id: "3",
    title: "Payment Successful!",
    description: "Shipping payment of $35 successfully made.",
    type: "Payment",
    date: "2024-06-15T04:52:06.501Z",
  },
  {
    id: "4",
    title: "Topup Successful!",
    description: "You successfully top up your e-wallet for $5930",
    type: "Topup",
    date: "2024-06-15T04:52:06.501Z",
  },
  {
    id: "5",
    title: "New Order Made!",
    description: "You have created a new shipping order",
    type: "Order",
    date: "2024-06-15T04:52:06.501Z",
  },
  {
    id: "6",
    title: "Payment Successful!",
    description: "Shipping payment of $45 successfully made.",
    type: "Payment",
    date: "2024-06-14T04:52:06.501Z",
  },
  {
    id: "7",
    title: "New Order Made!",
    description: "You have created a new shipping order",
    type: "Order",
    date: "2024-06-14T04:52:06.501Z",
  },
  {
    id: "8",
    title: "Top Up Successful!",
    description: "You successfully top up your e-wallet for $3400",
    type: "Topup",
    date: "2024-06-14T04:52:06.501Z",
  },
  {
    id: "9",
    title: "E-Wallet Connected!",
    description: "You have connected to the e-wallet",
    type: "Payment",
    date: "2024-06-14T04:52:06.501Z",
  },
  {
    id: "10",
    title: "New Order Made!",
    description: "You have created a new shipping order",
    type: "Order",
    date: "2024-06-14T04:52:06.501Z",
  },
];

export const TrackingHistory = [
  {
    id: "1",
    number: "MM09130520",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "2",
    number: "MM09130521",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "3",
    number: "MM09130523",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "4",
    number: "MM09130524",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "5",
    number: "MM09130525",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "6",
    number: "MM09130526",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "7",
    number: "MM09130527",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "8",
    number: "MM09130528",
    status: "On Progress",
    description: "On the way in delivery",
  },
  {
    id: "9",
    number: "MM09130500",
    status: "On Progress",
    description: "On the way in delivery",
  },
];

export const deliveryReviews = [
  {
    id: "1",
    avatar: images.user1,
    name: "John Smith",
    description:
      "The delivery was prompt and efficient! My package arrived in perfect condition, and the tracking updates were very helpful. Highly recommended! 😍",
    rating: 4.8,
    avgRating: 5,
    date: "2024-03-28T12:00:00.000Z",
    numLikes: 320,
  },
  {
    id: "2",
    avatar: images.user2,
    name: "Emily Davis",
    description:
      "I was thoroughly impressed with the delivery service. The package arrived on time, and the delivery person was very courteous. Definitely using this service again!",
    rating: 4.7,
    avgRating: 5,
    date: "2024-03-28T12:00:00.000Z",
    numLikes: 95,
  },
  {
    id: "3",
    avatar: images.user3,
    name: "Michael Rodriguez",
    description:
      "The delivery service exceeded my expectations! The package was delivered promptly, and the updates provided throughout the process were excellent. Will use this service again!",
    rating: 4.9,
    avgRating: 5,
    date: "2024-03-29T12:00:00.000Z",
    numLikes: 210,
  },
  {
    id: "4",
    avatar: images.user4,
    name: "Sarah Brown",
    description:
      "I had a wonderful experience with the delivery service. The package arrived in great condition, and the delivery was very fast. Highly recommend using this service!",
    rating: 4.5,
    avgRating: 5,
    date: "2024-03-29T12:00:00.000Z",
    numLikes: 150,
  },
  {
    id: "5",
    avatar: images.user5,
    name: "David Wilson",
    description:
      "Absolutely fantastic service! The delivery was quick and the package was handled with care. It's a must-try for anyone needing reliable delivery!",
    rating: 3.8,
    avgRating: 4,
    date: "2024-02-31T12:00:00.000Z",
    numLikes: 500,
  },
  {
    id: "6",
    avatar: images.user6,
    name: "Luca Dalasias",
    description:
      "The delivery service exceeded my expectations! The package arrived on time, and the condition was perfect. Will definitely use this service again!",
    rating: 4.8,
    avgRating: 5,
    date: "2024-02-29T12:00:00.000Z",
    numLikes: 210,
  },
];

export const packageList = [
  {
    latitude: 48.8566,
    longitude: 2.3522,
    name: "Package 1",
    description: "Package description 2",
  },
  {
    latitude: 43.2965,
    longitude: 5.3698,
    name: "Package 2",
    description: "Package description 2",
  },
  {
    latitude: 45.764,
    longitude: 4.8357,
    name: "Package 3",
    description: "Package description 3",
  },
  {
    latitude: 43.6045,
    longitude: 1.4442,
    name: "Package 4",
    description: "Package description 4",
  },
  {
    latitude: 43.7102,
    longitude: 7.2661,
    name: "Package 5",
    description: "Package description 5",
  },
];

export const locations = [
  {
    id: "1",
    location: "New Montgomery",
    address: "4517 Washington Ave. Manchester...",
    distance: "3.21 KM",
  },
  {
    id: "2",
    location: "Manchester",
    address: "2118 Thornridge Cir. Syracuse...",
    distance: "2.24 KM",
  },
  {
    id: "3",
    location: "New Castle",
    address: "2118 Thornridge Cir. Syracuse...",
    distance: "2.84 KM",
  },
];

export const outgoingShipments = [
  {
    id: 1,
    status: "Shipped",
    date: "29 Jan, 12:30",
    type: "Electronics",
    name: "Gadget Hub",
    image: images.package1,
    price: 499.99,
    numberOfItems: 1,
    trackingNumber: "#162432",
    address: "123 Main St, Cityville",
    receipt: "#A142C",
  },
  {
    id: 2,
    status: "Shipped",
    date: "30 Jan, 12:30",
    type: "Appliances",
    name: "HomeTech Solutions",
    image: images.package2,
    price: 899.99,
    numberOfItems: 1,
    trackingNumber: "#162422",
    address: "456 Oak St, Townsville",
    receipt: "#12AXD",
  },
  {
    id: 3,
    status: "Canceled",
    date: "30 Jan, 12:30",
    type: "Gaming",
    name: "Game Zone Express",
    image: images.package3,
    price: 299.99,
    numberOfItems: 1,
    trackingNumber: "#232432",
    address: "789 Pine St, Villagetown",
    receipt: "#XD234",
  },
  {
    id: 4,
    status: "Shipped",
    date: "29 Jan, 12:30",
    type: "Electronics",
    name: "Gadget Hub",
    image: images.package4,
    price: 499.99,
    numberOfItems: 1,
    trackingNumber: "#162432",
    address: "123 Main St, Cityville",
    receipt: "#A1424",
  },
  {
    id: 5,
    status: "Shipped",
    date: "30 Jan, 12:30",
    type: "Appliances",
    name: "HomeTech Solutions",
    image: images.package5,
    price: 899.99,
    numberOfItems: 1,
    trackingNumber: "#162422",
    address: "456 Oak St, Townsville",
    receipt: "#12AX2",
  },
  {
    id: 6,
    status: "Canceled",
    date: "30 Jan, 12:30",
    type: "Gaming",
    name: "Game Zone Express",
    image: images.package6,
    price: 299.99,
    numberOfItems: 1,
    trackingNumber: "#232432",
    address: "789 Pine St, Villagetown",
    receipt: "#FS234",
  },
];

export const incomingShipments = [
  {
    id: 1,
    status: "Delivered",
    date: "29 Jan, 12:30",
    type: "Electronics",
    name: "Gadget Hub",
    image: images.package3,
    price: 499.99,
    numberOfItems: 1,
    trackingNumber: "#162432",
    address: "Your Address",
    receipt: "#43X56",
  },
  {
    id: 2,
    status: "Delivered",
    date: "30 Jan, 12:30",
    type: "Appliances",
    name: "HomeTech Solutions",
    image: images.package4,
    price: 899.99,
    numberOfItems: 1,
    trackingNumber: "#162422",
    address: "Your Address",
    receipt: "#43AZ2",
  },
  {
    id: 3,
    status: "Canceled",
    date: "30 Jan, 12:30",
    type: "Gaming",
    name: "Game Zone Express",
    image: images.package5,
    price: 299.99,
    numberOfItems: 1,
    trackingNumber: "#232432",
    address: "Your Address",
    receipt: "#43012",
  },
  {
    id: 4,
    status: "Delivered",
    date: "29 Jan, 12:30",
    type: "Electronics",
    name: "Gadget Hub",
    image: images.package1,
    price: 499.99,
    numberOfItems: 1,
    trackingNumber: "#162432",
    address: "Your Address",
    receipt: "#43X56",
  },
  {
    id: 5,
    status: "Delivered",
    date: "30 Jan, 12:30",
    type: "Appliances",
    name: "HomeTech Solutions",
    image: images.package2,
    price: 899.99,
    numberOfItems: 1,
    trackingNumber: "#162422",
    address: "Your Address",
    receipt: "#43AZ2",
  },
  {
    id: 6,
    status: "Canceled",
    date: "30 Jan, 12:30",
    type: "Gaming",
    name: "Game Zone Express",
    image: images.package7,
    price: 299.99,
    numberOfItems: 1,
    trackingNumber: "#232432",
    address: "Your Address",
    receipt: "#43012",
  },
];
