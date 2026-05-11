
export interface RankInfo {
  rank: string;
  level: 'NATIONAL' | 'STATE' | 'RANGE' | 'DISTRICT' | 'SUBDIVISION' | 'CIRCLE' | 'STATION';
}

export const POLICE_RANKS: RankInfo[] = [
  { rank: 'DGP (Director General of Police)', level: 'STATE' },
  { rank: 'ADGP (Addl. Director General of Police)', level: 'STATE' },
  { rank: 'IGP (Inspector General of Police)', level: 'STATE' },
  { rank: 'DIG (Deputy Inspector General)', level: 'RANGE' },
  { rank: 'SSP (Senior Superintendent of Police)', level: 'DISTRICT' },
  { rank: 'SP (Superintendent of Police)', level: 'DISTRICT' },
  { rank: 'ASP (Assistant Superintendent of Police)', level: 'SUBDIVISION' },
  { rank: 'DSP (Deputy Superintendent of Police)', level: 'SUBDIVISION' },
  { rank: 'Inspector of Police', level: 'CIRCLE' },
  { rank: 'Sub-Inspector (SI) / Station House Officer', level: 'STATION' },
  { rank: 'Assistant Sub-Inspector (ASI)', level: 'STATION' },
  { rank: 'Head Constable', level: 'STATION' },
  { rank: 'Police Constable', level: 'STATION' },
];

export const INDIAN_STATES = [
  { name: "Andhra Pradesh", lat: 15.9129, lng: 79.7400, zoom: 7 },
  { name: "Arunachal Pradesh", lat: 28.2180, lng: 94.7278, zoom: 7 },
  { name: "Assam", lat: 26.2006, lng: 92.9376, zoom: 7 },
  { name: "Bihar", lat: 25.0961, lng: 85.3131, zoom: 7 },
  { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, zoom: 7 },
  { name: "Goa", lat: 15.2993, lng: 74.1240, zoom: 10 },
  { name: "Gujarat", lat: 22.2587, lng: 71.1924, zoom: 7 },
  { name: "Haryana", lat: 29.0588, lng: 76.0856, zoom: 8 },
  { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, zoom: 8 },
  { name: "Jharkhand", lat: 23.6102, lng: 85.2799, zoom: 7 },
  { name: "Karnataka", lat: 15.3173, lng: 75.7139, zoom: 7 },
  { name: "Kerala", lat: 10.8505, lng: 76.2711, zoom: 7 },
  { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, zoom: 7 },
  { name: "Maharashtra", lat: 19.7515, lng: 75.7139, zoom: 7 },
  { name: "Manipur", lat: 24.6637, lng: 93.9063, zoom: 8 },
  { name: "Meghalaya", lat: 25.4670, lng: 91.3662, zoom: 8 },
  { name: "Mizoram", lat: 23.1645, lng: 92.9376, zoom: 8 },
  { name: "Nagaland", lat: 26.1584, lng: 94.5624, zoom: 8 },
  { name: "Odisha", lat: 20.9517, lng: 85.0985, zoom: 7 },
  { name: "Punjab", lat: 31.1471, lng: 75.3412, zoom: 8 },
  { name: "Rajasthan", lat: 27.3913, lng: 73.4326, zoom: 7 },
  { name: "Sikkim", lat: 27.5330, lng: 88.5122, zoom: 9 },
  { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, zoom: 7 },
  { name: "Telangana", lat: 18.1124, lng: 79.0193, zoom: 7 },
  { name: "Tripura", lat: 23.9408, lng: 91.9882, zoom: 9 },
  { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, zoom: 7 },
  { name: "Uttarakhand", lat: 30.0668, lng: 79.0193, zoom: 8 },
  { name: "West Bengal", lat: 22.9868, lng: 87.8550, zoom: 7 },
  { name: "Andaman & Nicobar", lat: 11.7401, lng: 92.6586, zoom: 7 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794, zoom: 11 },
  { name: "Dadra & Nagar Haveli", lat: 20.1809, lng: 73.0169, zoom: 10 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, zoom: 11 },
  { name: "Jammu & Kashmir", lat: 33.7782, lng: 76.5762, zoom: 7 },
  { name: "Ladakh", lat: 34.1526, lng: 77.5771, zoom: 7 },
  { name: "Lakshadweep", lat: 10.5667, lng: 72.6417, zoom: 8 },
  { name: "Puducherry", lat: 11.9416, lng: 79.8083, zoom: 10 },
  { name: "National", lat: 20.5937, lng: 78.9629, zoom: 5 }
];

export const STATE_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa", "Nellore", "Anakapalle", "Kakinada", "Konaseema", "Eluru", "NTR", "Bapatla", "Palnadu", "Nandyal", "Sri Satya Sai", "Sri Balaji", "Annamayya"],
  "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul & Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  "Nagaland": ["Chumukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Pughoboto", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khorda", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Andaman & Nicobar": ["Nicobar", "North & Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra & Nagar Haveli": ["Dadra & Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu & Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  "National": ["Central Secretariat", "Diplomatic Zone", "Strategic Command"]
};

export const DISTRICT_COORDINATES: Record<string, [number, number]> = {
  "Mumbai City": [18.9220, 72.8347],
  "Mumbai Suburban": [19.1136, 72.8697],
  "Pune": [18.5204, 73.8567],
  "Nagpur": [21.1458, 79.0882],
  "Thane": [19.2183, 72.9781],
  "Aurangabad": [19.8762, 75.3433],
  "Chhatrapati Sambhajinagar": [19.8762, 75.3433],
  "Osmanabad": [18.1861, 76.0419],
  "Dharashiv": [18.1861, 76.0419],
  "Nashik": [19.9975, 73.7898],
  "Ahmednagar": [19.0948, 74.7480],
  "Ahilyanagar": [19.0948, 74.7480],
  "Beed": [18.9891, 75.7601],
  "Jalna": [19.8410, 75.8864],
  "Latur": [18.4088, 76.5604],
  "Parbhani": [19.2644, 76.7767],
  "Nanded": [19.1383, 77.3210],
  "Akola": [20.7002, 77.0082],
  "Amravati": [20.9320, 77.7523],
  "Solapur": [17.6599, 75.9064],
  "Kolhapur": [16.7050, 74.2433],
  "Sangli": [16.8524, 74.5815],
  "Satara": [17.6805, 73.9803],
  "Ratnagiri": [16.9902, 73.3120],
  "Sindhudurg": [16.1158, 73.5510],
  "Raigad": [18.5158, 73.1822],
  "Palghar": [19.6936, 72.7655],
  "Wardha": [20.7453, 78.6022],
  "Chandrapur": [19.9615, 79.2961],
  "Gadchiroli": [20.1848, 80.0003],
  "Gondia": [21.4624, 80.2205],
  "Bhandara": [21.1754, 79.6521],
  "Dhule": [20.9042, 74.7749],
  "Nandurbar": [21.3667, 74.2333],
  "Yavatmal": [20.3899, 78.1307],
  "Washim": [20.1011, 77.1333],
  "Hingoli": [19.7153, 77.1517],
  "Jalgaon": [21.0077, 75.5626],
  "Buldhana": [20.5290, 76.1842],
  "New Delhi": [28.6139, 77.2090],
  "South Delhi": [28.4962, 77.1945],
  "Central Delhi": [28.6453, 77.2457],
  "North Delhi": [28.6891, 77.1913],
  "West Delhi": [28.6600, 77.0850],
  "Bengaluru Urban": [12.9716, 77.5946],
  "Mysuru": [12.2958, 76.6394],
  "Lucknow": [26.8467, 80.9462],
  "Kanpur Nagar": [26.4499, 80.3319],
  "Patna": [25.5941, 85.1376],
  "Ahmedabad": [23.0225, 72.5714],
  "Surat": [21.1702, 72.8311],
  "Hyderabad": [17.3850, 78.4867],
  "Chennai": [13.0827, 80.2707],
  "Kolkata": [22.5726, 88.3639],
  "Jaipur": [26.9124, 75.7873],
  "Bhopal": [23.2599, 77.4126],
  "Guwahati": [26.1158, 91.7086],
  "Chandigarh": [30.7333, 76.7794]
};

export const COMMON_POLICE_STATIONS: Record<string, string[]> = {
  // MAHARASHTRA
  "Mumbai City": ["Colaba PS", "Marine Drive PS", "Azad Maidan PS", "Malabar Hill PS", "Cuffe Parade PS", "D.B. Marg PS", "Gamdevi PS", "Kala Chowki PS", "Byculla PS", "Worli PS"],
  "Mumbai Suburban": ["Andheri PS", "Bandra PS", "Borivali PS", "Ghatkopar PS", "Juhu PS", "Kurla PS", "Malad PS", "Santacruz PS", "Vile Parle PS", "Dahisar PS", "Kandivali PS"],
  "Pune": ["Shivajinagar PS", "Kothrud PS", "Deccan Gymkhana PS", "Bund Garden PS", "Chaturshringi PS", "Hadapsar PS", "Swargate PS", "Yerawada PS", "Kondhwa PS", "Vishrantwadi PS"],
  "Nagpur": ["Ambazari PS", "Sitabuldi PS", "Dhantoli PS", "Sadar PS", "Ganeshpeth PS", "Sakkardara PS", "Hudkeshwar PS"],
  "Thane": ["Naupada PS", "Kopri PS", "Wagle Estate PS", "Kapurbawdi PS", "Kasarvadavali PS"],
  "Aurangabad": ["City Chowk PS", "Kranti Chowk PS", "Vedant Nagar PS", "Begumpura PS", "Jawahar Nagar PS"],
  "Nashik": ["Panchavati PS", "Sarkarwada PS", "Bhadrakali PS", "Ambad PS", "Indira Nagar PS"],

  // DELHI
  "New Delhi": ["Parliament Street PS", "Tilak Marg PS", "Chanakyapuri PS", "Connaught Place PS", "Tughlak Road PS", "Mandir Marg PS", "North Avenue PS", "South Avenue PS"],
  "South Delhi": ["Saket PS", "Hauz Khas PS", "Malviya Nagar PS", "Mehrauli PS", "Vasant Vihar PS", "Greater Kailash PS", "Ambedkar Nagar PS"],
  "Central Delhi": ["Daryaganj PS", "IP Estate PS", "Jama Masjid PS", "Kamla Market PS", "Chandni Mahal PS", "Paharganj PS", "Karol Bagh PS"],
  "North Delhi": ["Civil Lines PS", "Sadar Bazar PS", "Maurice Nagar PS", "Kotwali PS", "Kashmere Gate PS"],
  "West Delhi": ["Rajouri Garden PS", "Punjabi Bagh PS", "Tilak Nagar PS", "Janakpuri PS", "Vikaspuri PS"],

  // KARNATAKA
  "Bengaluru Urban": ["Cubbon Park PS", "Vidhana Soudha PS", "Indiranagar PS", "Koramangala PS", "Jayanagar PS", "Malleswaram PS", "Whitefield PS", "K.R. Puram PS", "HSR Layout PS", "Ulsoor PS"],
  "Mysuru": ["Lashkar PS", "Mandi PS", "Devaraja PS", "Nazarbad PS", "K.R. PS"],
  "Belagavi": ["Market PS", "Khade Bazar PS", "Camp PS", "Tilakwadi PS"],

  // UTTAR PRADESH
  "Lucknow": ["Hazratganj PS", "Gautam Palli PS", "Cantt PS", "Vibhuti Khand PS", "Gomti Nagar PS", "Aliganj PS", "Mahanagar PS", "Hasan Ganj PS"],
  "Kanpur Nagar": ["Kotwali PS", "Kalyanpur PS", "Kidwai Nagar PS", "Swaroop Nagar PS", "Barra PS", "Gwaltoli PS"],
  "Varanasi": ["Lanka PS", "Dashashwamedh PS", "Cantonment PS", "Sigra PS", "Bhelupur PS"],
  "Prayagraj": ["Civil Lines PS", "Cantonment PS", "Georgetown PS", "Colonelganj PS"],
  "Noida": ["Sector 20 PS", "Sector 24 PS", "Sector 39 PS", "Sector 58 PS", "Sector 49 PS"],

  // BIHAR
  "Patna": ["Kotwali PS", "Gandhi Maidan PS", "Sachiwalaya PS", "Patliputra PS", "Shastri Nagar PS", "Kankarbagh PS", "Pataliputra PS"],
  "Gaya": ["Civil Lines PS", "Kotwali PS", "Magadh Medical PS"],

  // GUJARAT
  "Ahmedabad": ["Ellis Bridge PS", "Navrangpura PS", "Satellite PS", "Vastrapur PS", "Sabarmati PS", "Kalupur PS", "Shahibaug PS", "Naranpura PS"],
  "Surat": ["Athwa PS", "Lalgate PS", "Mahidharpura PS", "Umra PS", "Khatodara PS", "Katargam PS"],
  "Vadodara": ["Sayajigunj PS", "Raopura PS", "Gotri PS", "Panigate PS"],

  // TELANGANA
  "Hyderabad": ["Banjara Hills PS", "Jubilee Hills PS", "Punjagutta PS", "Abids PS", "Begumpet PS", "Humayun Nagar PS", "Asif Nagar PS"],
  "Cyberabad": ["Madhapur PS", "Gachibowli PS", "Miyapur PS", "Kukatpally PS"],

  // TAMIL NADU
  "Chennai": ["Anna Nagar PS", "Mylapore PS", "T. Nagar PS", "Adyar PS", "Kilpauk PS", "Flower Bazaar PS", "Royapettah PS", "Triplicane PS"],
  "Coimbatore": ["R.S. Puram PS", "Race Course PS", "Peelamedu PS", "Singanallur PS"],

  // WEST BENGAL
  "Kolkata": ["Park Street PS", "Bhowanipore PS", "Alipore PS", "Gariahat PS", "Salt Lake PS", "Bowbazar PS", "New Market PS", "Hare Street PS", "Shakespeare Sarani PS"],
  "Darjeeling": ["Sadar PS", "Jorebunglow PS", "Kurseong PS"],

  // RAJASTHAN
  "Jaipur": ["Manak Chowk PS", "Sanganer PS", "Malviya Nagar PS", "Vaishali Nagar PS", "Vidhyadhar Nagar PS", "Jyoti Nagar PS", "Bani Park PS"],
  "Jodhpur": ["Sardarpura PS", "Shastri Nagar PS", "Ratanada PS"],

  // MADHYA PRADESH
  "Bhopal": ["MP Nagar PS", "Arera Colony PS", "TT Nagar PS", "Habibganj PS", "Koh-e-Fiza PS", "Jahangirabad PS"],
  "Indore": ["Vijay Nagar PS", "Rajwada PS", "Sanyogitaganj PS", "Palasia PS", "Bhanwarkuan PS"],

  // PUNJAB
  "Amritsar": ["Civil Lines PS", "C-Division PS", "Kotwali PS"],
  "Ludhiana": ["Division No 1 PS", "Division No 5 PS", "Sarabha Nagar PS"],

  // HARYANA
  "Gurugram": ["DLF Phase 1 PS", "Sector 29 PS", "Sadar PS", "Sector 56 PS", "Udyog Vihar PS", "Cyber City PS"],
  "Faridabad": ["Central PS", "Sector 7 PS", "Sector 31 PS"],

  // CHANDIGARH
  "Chandigarh": ["Sector 17 PS", "Sector 34 PS", "Sector 3 PS", "Sector 31 PS", "Sarangpur PS"],

  // UTTERAKHAND
  "Dehradun": ["Dalanwala PS", "Kotwali PS", "Cantonment PS", "Rajpur PS"],

  // JAMMU & KASHMIR
  "Srinagar": ["Kothi Bagh PS", "Shergarhi PS", "Ram Munshi Bagh PS"],
  "Jammu": ["Gandhi Nagar PS", "Bahu Fort PS", "City PS"]
};

