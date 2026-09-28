import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  BookOpen,
  Building2,
  Search,
  X,
  RefreshCw,
  Download,
  Save,
  FileSpreadsheet,
  CheckCircle2,
  Filter,
  Lock,
  TableProperties,
  Eye,
  EyeOff,
  Users,
  GraduationCap,
  UserCheck,
  Link2,
  Target,
  CheckSquare, 
  Square,
  ShieldCheck,
  ExternalLink,
  History,
  Activity,
  Plus,
  Trash2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * FIREBASE CONFIGURATION (PRODUCTION)
 */
const firebaseConfig = {
  apiKey: "AIzaSyAgZUtc5aZguYz_MW5zISkuLvDgPmDixfg",
  authDomain: "meratus-frd-lms-10276.firebaseapp.com",
  projectId: "meratus-frd-lms-10276",
  storageBucket: "meratus-frd-lms-10276.firebasestorage.app",
  messagingSenderId: "845694770386",
  appId: "1:845694770386:web:f103c31b21d082c8fd610b",
  measurementId: "G-KEV4HZQ53M"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app); 
const auth = getAuth(app);
const db = getFirestore(app);

const DEFAULT_TSV = `No\tNama Module\tStatus\tGroup SBU/SFU\tSME\tLink Terbaru\tLink File Lama
1\tAction Tracker 2023\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
2\tAI Workshop - AI Implementation & Use Cases\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
3\tAI Workshop - Understanding the AI Landscape 2024\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
4\tAsset & Charter - Basic Understanding Marine Insurance\tUnchanged\tAsset & Charter\tIrma\t\t
5\tAsset & Charter - Chartering Operations\tUnchanged\tAsset & Charter\tReza\t\t
6\tAsset & Charter - Digital Inspection and Documentation Software\tUnchanged\tAsset & Charter\tRizal Perdana\t\t
7\tAsset & Charter - IMO Regulation: SOLAS\tUnchanged\tAsset & Charter\tRizal Perdana\t\t
8\tAsset & Charter - Inspeksi QSHE Alat Berat Depo\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
9\tAsset & Charter - Inspeksi QSHE Alat Berat Terminal\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
10\tAsset & Charter - Inspeksi QSHE Operational Trucking MJT\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
11\tAsset & Charter - Inspeksi QSHE Repair Container\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
12\tAsset & Charter - Inspeksi QSHE Warehouse\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
13\tAsset & Charter - Introduction to Asset & Charter Business\tUnchanged\tAsset & Charter\tJorn\t\t
14\tAsset & Charter - Introduction to Chartering\tUnchanged\tAsset & Charter\tFibriani\t\t
15\tAsset & Charter - ISO 9001:2015\tUnchanged\tAsset & Charter\tMunir\t\t
16\tAsset & Charter - Lifting Cargoes on Flat Rack Container\tUnchanged\tAsset & Charter\tCapt. Fajar\t\t
17\tAsset & Charter - Non Vessel Asset Management (Truck & Trailer)\tUnchanged\tAsset & Charter\tTroy Sondakh\t\t
18\tAsset & Charter - Non Vessel: Risk Classification & Measurement\tUnchanged\tAsset & Charter\tTroy Sondakh\t\t
19\tAsset & Charter - Pemahaman SMS melalui QSHE Barriers\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
20\tAsset & Charter - Standar Pedoman Implementasi QSHE Non Vessel\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
21\tAsset Charter: IMO Regulation - Marine Pollution (MARPOL)\tUnchanged\tAsset & Charter\tRizal Perdana\t\t
22\tBA - Asset & Charter: Introduction to QSHE Meratus\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
23\tBA - CLC: Container Repair Process\tUnchanged\tCLC\tRama Setiawan\t\t
24\tBA - CLC: MLO Depot Business & Marketing Strategy\tUnchanged\tCLC\tIhsanil & Sofyan\t\t
25\tBA - CLC: Receiving Delivery and Stuffing Stripping Process at Depo\tUnchanged\tCLC\tYusuf Hidayat\t\t
26\tBA - Liner: Basic Container\tUnchanged\tLiner Commercial\tRaja\t\t
27\tBA - Liner: Basic Knowledge Terminal Operation\tUnchanged\tLiner Ops\tNovi Herwanto\t\t
28\tBA - Liner: Introduction to MFEC\tUnchanged\tLiner Ops\tBasuki Dwi\t\t
29\tBA - Liner: Product Knowledge Meratus Liner\tUnchanged\tLiner Commercial\tAndria Trisno\t\t
30\tBA - Liner: Service Excellence\tUnchanged\tLiner Commercial\tWicky Andry\t\t
31\tBA - Liner: Term of Shipment\tUnchanged\tLiner Commercial\tCastella Nostra\t\t
32\tBA - Logistics: Basic Knowledge Reefer\tUnchanged\tLogistics\tCahyanto Hidayat\t\t
33\tBA - Logistics: Customs Clearance\tUnchanged\tLogistics\tAgus Sapto Mulyono\t\t
34\tBA - Logistics: Sea Freight Domestic\tUnchanged\tLogistics\tMohamad Iqbal\t\t
35\tBA - Logistics: Warehouse & Transport\tUnchanged\tLogistics\tAryanto Wicaksono\t\t
36\tBA - MSM: Introduction to Ship Management\tUnchanged\tMSM\tDimas Dewangga\t\t
37\tBA - MTM: Heavy Equipment Maintenance\tUnchanged\tMTM\tArief Budiman\t\t
38\tBasic CLC - Terminal : Basic Knowledge Business Process CLC & Terminal\tUnchanged\tCLC\tAnina\t\t
39\tBasic CLC : Depo Management\tUnchanged\tCLC\tArif Wibowo (MSA)\t\t
40\tBasic CLC : Heavy Equipment\tUnchanged\tCLC\tWily A.\t\t
41\tBasic CLC : Pengetahuan Bongkar Muat\tUnchanged\tCLC\tArief Budiman\t\t
42\tBasic CLC : Repair Container\tUnchanged\tCLC\tRachmad A. / Tias G.\t\t
43\tBasic CLC: Penyerahan dan Penerimaan Kontainer\tUnchanged\tCLC\tYusuf Hidayat\t\t
44\tBasic English - 16 Basic Tenses\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
45\tBasic English - Email Writing\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
46\tBasic English - Negotiation Skills\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
47\tBasic English - Preposition of Time\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
48\tBasic English - Presentation Skills\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
49\tBasic Excel Function\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
50\tBasic Logistic : HS Code dan Kepabeanan\tUnchanged\tLogistics\tAgus Sapto Mulyono\t\t
51\tBasic Logistic : Reefer Container Handling\tUnchanged\tLogistics\tCahyanto Hidayat\t\t
52\tBasic Logistics - Commercial : Account Plan\tUnchanged\tLogistics\tBenediktus Hartono\t\t
53\tBasic Logistics - Commercial : Basic Agency & International Service\tUnchanged\tLogistics\tPutri Handayani / Benediktus H.\t\t
54\tBasic Logistics - Commercial : Incoterms Logistics\tUnchanged\tLogistics\tKevin Lionar\t\t
55\tBasic Logistics - Commercial : Sales Skills\tUnchanged\tLogistics\tKevin Lionar\t\t
56\tBasic Logistics - Commercial: Exim dan Incoterms\tUnchanged\tLogistics\tKevin Lionar\t\t
57\tBasic Logistics - Operations: Operation Monitoring & System Support\tUnchanged\tLogistics\tRipta Rarung Raska\t\t
58\tBasic Logistics - Operations: SCM Profit\tUnchanged\tLogistics\tDhoni Prasetia\t\t
59\tBasic Logistics - P3W Sales\tUnchanged\tLogistics\tKevin Lionar\t\t
60\tBasic Logistics : Account Receivable\tUnchanged\tLogistics\tRandy Alexandria\t\t
61\tBasic Logistics : Airfreight\tUnchanged\tLogistics\tCandida Tresty Hastuti, S.E.\t\t
62\tBasic Logistics : Basic Knowledge Business Process Logistics\tUnchanged\tLogistics\tRina Susanti Hamzah\t\t
63\tBasic Logistics : Basic LCL (Less than Container Load)\tUnchanged\tLogistics\tKadek Mega Apriyana, S.Si\t\t
64\tBasic Logistics : Basic Operation\tUnchanged\tLogistics\tFajar Wahyu / Ripta Rarung Raska\t\t
65\tBasic Logistics : Custom Clearence\tUnchanged\tLogistics\tAgus Sapto Mulyono\t\t
66\tBasic Logistics : Customer Service\tUnchanged\tLogistics\tBenediktus Hartono\t\t
67\tBasic Logistics : Industrial Project\tUnchanged\tLogistics\tI Gusti Nyoman Wiyadi\t\t
68\tBasic Logistics : Pemahaman Klaim & Asuransi\tUnchanged\tLogistics\tRichard Siswanto Wibawa\t\t
69\tBasic Logistics : Quality Management System\tUnchanged\tLogistics\tRichard Siswanto Wibawa\t\t
70\tBasic Logistics : Sea Freight\tUnchanged\tLogistics\tMohamad Iqbal / Putri Handayani\t\t
71\tBasic Logistics : Warehouse & Transport\tUnchanged\tLogistics\tAryanto Wicaksono\t\t
72\tBasic Logistics: Vendor Management\tUnchanged\tLogistics\tAgnes Mega Arista / Henry Limanto\t\t
73\tBasic Operation : 3. Port Info & Ship Particular\tUnchanged\tLiner Ops\tNovi Herwanto\t\t
74\tBasic Operation : 4. Loading & Unloading\tUnchanged\tLiner Ops\tNovi Herwanto\t\t
75\tBasic Operation : 9. IMDG Code\tUnchanged\tLiner Ops\tAgung Wibowo\t\t
76\tBasic Operation: 5. Container Inventory Management\tUnchanged\tLiner Ops\tMiftakh Lutfi Ansori\t\t
77\tBasic Public Speaking Skills\tUnchanged\tHMM\tDamar Sari Wulaan\t\t
78\tBasic Shipping : Basic Knowledge Business Process Shipping (Liner)\tUnchanged\tBPM\tWidhi / Yudi\t\t
79\tBPM - Assessment for Digital Transformation\tUnchanged\tBPM\tAdityo\t\t
80\tBPM - Basic Shipping Induction Inbound and Outbound Process\tUnchanged\tBPM\tAgung\t\t
81\tBPM - Business Process Management Framework\tUnchanged\tBPM\tAdityo / Janan\t\t
82\tBPM - Core Model Framework\tUnchanged\tBPM\tAgung\t\t
83\tBPM - Management of P3W\tUnchanged\tBPM\tWidyaphiana\t\t
84\tBPM - Project Management\tUnchanged\tBPM\tNaim\t\t
85\tBPM - Work Load Analysis for Project\tUnchanged\tBPM\tAgung / Widhi\t\t
86\tBusiness Control Framework 2024\tUnchanged\tInternal Audit\tNuri\t\t
87\tBusiness Negotiation Skill (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
88\tBusiness Presentation Skill (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
89\tBusiness Process Modelling for Level 10&Above\tUnchanged\tBPM\tWidhi / Yudi\t\t
90\tCLC - Backlog Management\tUnchanged\tCLC\tArief B. / Fakhrudin A.\t\t
91\tCLC - Block Diagram pada System Electric\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
92\tCLC - Block Diagram pada System Engine\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
93\tCLC - Block Diagram pada System Hydraulic\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
94\tCLC - Brake System\tUnchanged\tCLC\tAkhmad Rohudan\t\t
95\tCLC - Cara Menggunakan Common Tool\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
96\tCLC - Daily Maintenance\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
97\tCLC - Differential & Final Drive\tUnchanged\tCLC\tAkhmad Rohudan\t\t
98\tCLC - Electrical System\tUnchanged\tCLC\tAkhmad Rohudan\t\t
99\tCLC - Engine System\tUnchanged\tCLC\tAkhmad Rohudan\t\t
100\tCLC - Failure Analisis Report\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
101\tCLC - Hydraulic System\tUnchanged\tCLC\tAkhmad Rohudan\t\t
102\tCLC - Hydraulic Troubleshooting\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
103\tCLC - Karakteristik Komponen Elektrik\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
104\tCLC - Karakteristik Komponen Non Elektrik\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
105\tCLC - Maintenance Process\tUnchanged\tCLC\tArief B. / Imam Fauzi\t\t
106\tCLC - Mekanik Troubleshooting\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
107\tCLC - Nama, Fungsi, & Prinsip Kerja Komponen Engine\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
108\tCLC - Pembacaan Menu pada Monitoring System\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
109\tCLC - Penanganan Claim Container\tUnchanged\tCLC\tErwin Sundoro\t\t
110\tCLC - Pengenalan Fungsi dari Komponen Accesories\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
111\tCLC - Pengenalan Fungsi dari Komponen Electric\tUnchanged\tCLC\tAkhmad Rohudan\t\t
112\tCLC - Pengenalan Fungsi dari Komponen Hydraulic\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
113\tCLC - Pengenalan Fungsi dari Komponen Power Train\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
114\tCLC - Pengetahuan Forklift\tUnchanged\tCLC\tImam Fauzi\t\t
115\tCLC - Pengetahuan Reach Stacker\tUnchanged\tCLC\tImam Fauzi\t\t
116\tCLC - Perencanaan Kebutuhan Alat Mekanis\tUnchanged\tCLC\tLiman Rajagukguk\t\t
117\tCLC - Perencanaan Lay Out Depo\tUnchanged\tCLC\tIhsanil Arsyad\t\t
118\tCLC - Pricing Strategy\tUnchanged\tCLC\tArief W / Erick Apriyadi\t\t
119\tCLC - Setting and Adjustment (Major Component)\tUnchanged\tCLC\tImam Fauzi / Akhmad Rohudan\t\t
120\tCLC - Stack Hampar Container\tUnchanged\tCLC\tReni Ruhulessin\t\t
121\tCLC - Stuffing Stripping\tUnchanged\tCLC\tReni Ruhulessin\t\t
122\tCLC - Teknik Dasar Pengelasan\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
123\tCLC - Teknik Lepas & Pasang Komponen Electric\tUnchanged\tCLC\tAkhmad Rohudan / Akhmad Rohudan\t\t
124\tCLC - Teknik Survey & Quality Control\tUnchanged\tCLC\tRachmad A. / Tias G.\t\t
125\tCLC - Tyre Management\tUnchanged\tCLC\tFakhrudin A.\t\t
126\tCLC - Upload & Download Program pada Unit\tUnchanged\tCLC\tAkhmad Rohudan\t\t
127\tCLC - Yard Management system\tUnchanged\tCLC\tLiman Rajagukguk\t\t
128\tCLC- Penanganan Cargo\tUnchanged\tCLC\tArif Wibowo (MSA)\t\t
129\tCode of Conduct\tUnchanged\tInternal Audit\tNuri\t\t
130\tCode of Conduct (English Version)\tUnchanged\tInternal Audit\tNuri\t\t
131\tCode of Conduct for Manager\tUnchanged\tInternal Audit\tNuri\t\t
132\tCompany Profile 2024\tUnchanged\tCorpCom\tPurnama Aditya\t\t
133\tCompany Regulation 2025-2027 (English Version)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
134\tCompany Regulation 2025-2027 (Indonesian Version)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
135\tContract Management System for Level 10&Above\tUnchanged\tLegal\tFebe/Jane\t\t
136\tControl and Monitoring (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
137\tCorp Comm - Branding Development\tUnchanged\tCorpCom\tPurnama Aditya\t\t
138\tCorp Comm - Communication Campaign\tUnchanged\tCorpCom\tPurnama Aditya\t\t
139\tCorporate Culture 2025\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
140\tCrewing - Awareness ISO 37001:2016\tUnchanged\tCrewing\tAris Mudhahar\t\t
141\tCrewing - Pelatihan Audit Internal ISO 37001:2016\tUnchanged\tCrewing\tAris Mudhahar\t\t
142\tEdukasi Pemilahan Sampah\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
143\tEffective Collaboration (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
144\tEffective Planning (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
145\tFin & Acc - Bills to Invoice\tUnchanged\tFinance\tDwi Rachmawati / Ariya Permana\t\t
146\tFin & Acc - Vendor Invoice Acceptance\tUnchanged\tFinance\tAriya Permana / Novita N.\t\t
147\tFraud Awareness\tUnchanged\tInternal Audit\tNuri / Ahmad Fasih\t\t
148\tGA - Vehicle Maintenance\tUnchanged\tGA/Asset Property\tPrima/Grace\t\t
149\tGA - Vehicle Selling\tUnchanged\tGA/Asset Property\tPrima/Grace\t\t
150\tGA - Vehicle Usage\tUnchanged\tGA/Asset Property\tPrima/Grace\t\t
151\tGood Corporate Governance 2024\tUnchanged\tInternal Audit\tNuri\t\t
152\tGroup Policy - Authority Matrix\tUnchanged\tFinance\tMarini\t\t
153\tGroup Policy - CAPEX\tUnchanged\tFinance\tMarini\t\t
154\tGroup Policy for Level 10&Above\tUnchanged\tInternal Audit\tNuri\t\t
155\tHealth Talk - Pencernaan Kuat, Hidup Nikmat\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
156\tHealth Talk: Hari Anak - Ready, Set, School 2024\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
157\tHealth Talk: Virus Monkeypox\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
158\tHMM - Claim Procedure\tUnchanged\tHMM\tTri\t\t
159\tHMM - Stowage & Cargo Overview\tUnchanged\tHMM\tDhani / Nuryadi\t\t
160\tHow To Create Contract - TPS (HMM)\tUnchanged\tHMM\tAkmal\t\t
161\tHR - Aspek Normatif Hubungan Industrial\tUnchanged\tHRD\tErlina\t\t
162\tHR - Manajemen Remunerasi\tUnchanged\tHRD\tHana\t\t
163\tHR - Manajemen Talenta\tUnchanged\tHRD\tHana\t\t
164\tHR - Melaksanakan Analisa Beban Kerja\tUnchanged\tHRD\tRudy Sudiono\t\t
165\tHR - Membangun Komunikasi Organisasi Yang Efektif\tUnchanged\tHRD\tErlina\t\t
166\tHR - Menyusun dan Merancang Kebutuhan Pembelajaran\tUnchanged\tHRD\tAndrew Fatah Erlangga\t\t
167\tHR - Menyusun Kebutuhan SDM\tUnchanged\tHRD\tSherly\t\t
168\tHR - Menyusun Peraturan Perusahaan & Perjanjian Kerja\tUnchanged\tHRD\tErlina\t\t
169\tHR - Menyusun Uraian Jabatan\tUnchanged\tHRD\tRudy\t\t
170\tHR - Merancang Struktur Organisasi\tUnchanged\tHRD\tRudy\t\t
171\tHR - Merumuskan Indikator Kinerja Individu\tUnchanged\tHRD\tRudy\t\t
172\tHR - Merumuskan Proses Bisnis dan SOP MSDM\tUnchanged\tHRD\tJahja\t\t
173\tHR - Merumuskan Strategi Manajemen SDM\tUnchanged\tHRD\tJahja\t\t
174\tHR - Perselisihan Hubungan Industrial\tUnchanged\tHRD\tErlina\t\t
175\tHR - Strategic Interviewing\tUnchanged\tHRD\tSherly\t\t
176\tInternal Audit - Enterprise Risk Management\tUnchanged\tInternal Audit\tNuri\t\t
177\tIntroduction to E-Pact (Employee Self Service)\tUnchanged\tHRD\tWiyono Saputra\t\t
178\tIntroduction to HRIS & Time Management Module PeopleStrong\tUnchanged\tHRD\tRachma\t\t
179\tIntroduction to Manager as A Profession\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
180\tIntroduction to Objectives & Key Results 2024\tUnchanged\tHRD\tRudy Sudiono\t\t
181\tIntroduction to PeopleStrong – Learning Module\tUnchanged\tHRD\tMeilinda Taslim\t\t
182\tIR Management for Level 10&Above - 2025\tUnchanged\tHRD\tErlina\t\t
183\tIT - Agile: Scrum Introduction\tUnchanged\tIT\tRif'an Handoko / Naim Rohatun\t\t
184\tIT - BitLocker Implementation Security Awareness\tUnchanged\tIT\tRudy Fajar\t\t
185\tIT - Cybersecurity Awareness 2023\tUnchanged\tIT\tRudy Fajar\t\t
186\tIT - Design System\tUnchanged\tIT\tAlfian Nugraha\t\t
187\tIT - Electronic Data Interchange Introduction\tUnchanged\tIT\tAhmad Zainuri\t\t
188\tIT - Implementation of Cast Software as Software Intelligence\tUnchanged\tIT\tRizal Purnama Sidik\t\t
189\tIT - Implementing RPA to Support The Business\tUnchanged\tIT\tAzka Aprianta Tiantoro\t\t
190\tIT - Infrastructure and Application Modernization\tUnchanged\tIT\tAhmad Zainuri\t\t
191\tIT - Introduction to Microsoft Fabric\tUnchanged\tIT\ttanya ke Udadhi/Handi Dwi R\t\t
192\tIT - Meratus ACE Support Services\tUnchanged\tIT\tAgung A. / Arief Suhamdi\t\t
193\tIT - Network Operation Center Introduction\tUnchanged\tIT\tHandy Firmansyah / M Rusy Dermawan\t\t
194\tIT - Personal Data Protection Law: Things You Need to Know\tUnchanged\tIT\ttanya ke Udadhi/Handi Dwi R\t\t
195\tIT - Remote Monitoring System for Vessel IoT Solution\tUnchanged\tIT\ttanya ke Udadhi/Handi Dwi R\t\t
196\tIT - Secure Access Service Edge (SASE)\tUnchanged\tIT\ttanya ke Udadhi/Handi Dwi R\t\t
197\tIT - Test Driven Development Introduction\tUnchanged\tIT\tMutiara Nova / Anang Shaleh Bakti\t\t
198\tIT - Understanding Security in Development and Operations\tUnchanged\tIT\tRizal Purnama Sidik\t\t
199\tIT - UX Research\tUnchanged\tIT\tAlfian Nugraha\t\t
200\tIT- Clean Architecture Design Pattern\tUnchanged\tIT\tArdha\t\t
201\tLeaders Talk: Artificial Intelligence\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
202\tLeaders Talk: Create Value Through Integrity - 2024\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
203\tLeaders Talk: Economic Outlook\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
204\tLeaders Talk: Hari Anti Korupsi Sedunia\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
205\tLeaders Talk: Intrapreneurship (Result Oriented)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
206\tLeaders Talk: Intrapreneurship (Sense of Ownership)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
207\tLeaders Talk: Kenali Demam Berdarah dan Pencegahannya\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
208\tLeaders Talk: Lesson from Eiger - From Local to the World\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
209\tLeaders Talk: Nutrition Day 2024\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
210\tLeaders Talk: We Aim for Customer Excellence (Collaboration)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
211\tLeaders Talk: We Put People First (Be A Buddy)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
212\tLegal - Amendment to Indonesian Shipping Law 101\tUnchanged\tLegal\tIke A, Donny W, Jane M\t\t
213\tLegal - Implementation of Shipping Law\tUnchanged\tLegal\tIke A, Donny W, Jane M\t\t
214\tLegal - Indonesia Capital Market\tUnchanged\tLegal\tIke A, Donny W, Jane M\t\t
215\tLegal - Overview of Indonesia Employment Law\tUnchanged\tLegal\tIke A, Donny W, Jane M\t\t
216\tLegal - Personal Data Protection\tUnchanged\tLegal\tIke A, Donny W, Jane M\t\t
217\tLegal - Teknik Merancang Kontrak\tUnchanged\tLegal\tIke A, Donny W, Jane M\t\t
218\tLiner - Basic Operation : Transshipment\tUnchanged\tLiner Ops\tAnang Setiawan\t\t
219\tLiner Commercial - Business Development\tUnchanged\tLiner Commercial\tFitrisia Kartika\t\t
220\tLiner Commercial - Basic Shipping : 07. Term of Shipment\tUnchanged\tLiner Commercial\tAndria Trisno\t\t
221\tLiner Commercial - Basic Shipping : 11. Basic Container\tUnchanged\tLiner Commercial\tRizkhi Fajrie, Luthfi Anshori\t\t
222\tLiner Commercial - Basic Shipping : 13. Reefer Handling\tUnchanged\tLiner Commercial\tRizkhi Fajrie\t\t
223\tLiner Commercial - Basic Shipping : 14. Breakbulk Cargo & Project\tUnchanged\tLiner Commercial\tNovi Herwanto\t\t
224\tLiner Commercial - Basic Shipping : 15. Cost of Failure Branch\tUnchanged\tLiner Commercial\tWicky Andry, Rizkhi\t\t
225\tLiner Commercial - Basic Shipping : 16. Sales Activity & Customer Profile\tUnchanged\tLiner Commercial\tRindra Bagus Bagus, Anton Punthie\t\t
226\tLiner Commercial - Basic Shipping : 2. Product Knowledge and Cargo Shipment\tUnchanged\tLiner Commercial\tCipta Wiraswasta\t\t
227\tLiner Commercial - Basic Shipping : 4.Basic Cargo Knowledge\tUnchanged\tLiner Commercial\tCipta Wiraswasta\t\t
228\tLiner Commercial - Basic Shipping : 6. Bill of Lading\tUnchanged\tLiner Commercial\tIpoeng Purwadi, Citra Kinanti\t\t
229\tLiner Commercial - Basic Shipping : Booking Process\tUnchanged\tLiner Commercial\tWicky Andry, Ipoeng\t\t
230\tLiner Commercial - Basic Shipping: 1.Service Excellence\tUnchanged\tLiner Commercial\tWicky Andry, Ipoeng Purwadi\t\t
231\tLiner Commercial - Basic Shipping: 10. Liner Services\tUnchanged\tLiner Commercial\tWayan Sion\t\t
232\tLiner Commercial - Basic Shipping: 12. Dangerous Goods\tUnchanged\tLiner Commercial\tNovi Herwanto, Agung Wibowo\t\t
233\tLiner Commercial - Basic Shipping: 3. FAQ for Customer\tUnchanged\tLiner Commercial\tWicky Andry, Cipta Wiraswasta\t\t
234\tLiner Commercial - Basic Shipping: 8. Terminal Productivity & Operation Pattern\tUnchanged\tLiner Commercial\tAnang Setiawan\t\t
235\tLiner Commercial - Basic Shipping: Incoterm 2020\tUnchanged\tLiner Commercial\tNurleli, Andria Trisno\t\t
236\tLiner Commercial - Basic Shipping: Marine Insurance\tUnchanged\tLiner Commercial\tIrma Vistarini\t\t
237\tLiner Commercial - Basic Shipping: Meratus Extra (VAS)\tUnchanged\tLiner Commercial\tStephen Octavian\t\t
238\tLiner Commercial - Basic Shipping: Pengetahuan Kepabeanan dan Exim untuk Pelayaran\tUnchanged\tLiner Commercial\tAndria Trisno\t\t
239\tLiner Commercial - Body Language\tUnchanged\tLiner Commercial\tWicky Andry\t\t
240\tLiner Commercial - Calculate Rate & Freight\tUnchanged\tLiner Commercial\tAnton Punthie\t\t
241\tLiner Commercial - Customer Contract & Key Account Management\tUnchanged\tLiner Commercial\tSamuel Jonathan\t\t
242\tLiner Commercial - Decision Making Unit\tUnchanged\tLiner Commercial\tAndria Trisno\t\t
243\tLiner Commercial - Halal Cargo Assurance\tUnchanged\tLiner Commercial\tAndria Trisno\t\t
244\tLiner Commercial - Know Your Customer\tUnchanged\tLiner Commercial\tAndria Trisno\t\t
245\tLiner Commercial - Marine Cargo Insurance\tUnchanged\tLiner Commercial\tSebastianus Raja\t\t
246\tLiner Commercial - SOC Business\tUnchanged\tLiner Commercial\tNurleli\t\t
247\tLiner Commercial: Handling Complaint\tUnchanged\tLiner Commercial\tWicky Andry\t\t
248\tLiner Ops - MFEC: Operational Ship Performance\tUnchanged\tLiner Ops\tMarcus Melkianus Takain\t\t
249\tLiner Ops - Ship Stability\tUnchanged\tLiner Ops\tNovi Herwanto\t\t
250\tLiner Ops - Voyage Proforma & Scheduling Introduction\tUnchanged\tLiner Ops\tNovi Herwanto\t\t
251\tLiner Trade - 01. Route Profitability\tUnchanged\tLiner Trade\tTrade / Filemon\t\t
252\tLiner Trade - Annual Budgeting\tUnchanged\tLiner Trade\tYeni Triana\t\t
253\tLiner Trade - Contribution Margin Engine, Time Charter Equivalent, and VOE\tUnchanged\tLiner Trade\tYeni Triana, Castella Nostra / Sion\t\t
254\tLiner Trade - Customer Segmentation\tUnchanged\tLiner Trade\tSion\t\t
255\tLiner Trade - Joint Slot 2024\tUnchanged\tLiner Trade\tYeni Triana\t\t
256\tLiner Trade - Slot Cost\tUnchanged\tLiner Trade\tSion\t\t
257\tLiner Trade - Tier Pricing\tUnchanged\tLiner Trade\tDanang\t\t
258\tLogistics - Cargo & Document Handling\tUnchanged\tLogistics\tFajar Wahyu, Ripta Rarung Raska\t\t
259\tLogistics - Claim and Insurance\tUnchanged\tLogistics\tRichard Siswanto Wibawa\t\t
260\tLogistics - ISO License Audit Process\tUnchanged\tLogistics\tYudi Darmanto\t\t
261\tLogistics - Penerapan SJPH dan Penyelia Halal\tUnchanged\tLogistics\tYudi Darmanto\t\t
262\tLogistics - Vendor Management: Sea Freight Domestic\tUnchanged\tLogistics\tHenry Limanto\t\t
263\tM-One : Customer Journey\tUnchanged\tBPM\tIntan\t\t
264\tM-One : Induction M-One for Internal Stakeholders\tUnchanged\tBPM\tNaim\t\t
265\tManagement by Objective (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
266\tManaging Conflicts (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
267\tManaging Conversation (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
268\tManaging Meeting (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
269\tManaging Superiors and Colleagues (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
270\tManaging Yourself (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
271\tMELISA - Booking Module\tUnchanged\tBPM\tWidhi / Yudi\t\t
272\tMELISA - Customer Master\tUnchanged\tBPM\tWidhi / Yudi\t\t
273\tMELISA - Customer Tier Pricing DSS\tUnchanged\tBPM\tWidhi / Yudi\t\t
274\tMELISA - Documentation Module\tUnchanged\tBPM\tWidhi / Yudi\t\t
275\tMELISA - Invoice Data Reference\tUnchanged\tBPM\tWidhi / Yudi\t\t
276\tMELISA - Invoicing Module v0\tUnchanged\tBPM\tWidhi / Yudi\t\t
277\tMELISA - Node Master 2024\tUnchanged\tBPM\tWidhi / Yudi\t\t
278\tMELISA - On/Off Hire Module 2024\tUnchanged\tBPM\tWidhi / Yudi\t\t
279\tMELISA - Penalty Booking\tUnchanged\tBPM\tWidhi / Yudi\t\t
280\tMELISA - Port Call Report 2024\tUnchanged\tBPM\tWidhi / Yudi\t\t
281\tMelisa - Quick Manual Container Movement and Status\tUnchanged\tBPM\tWidhi / Yudi\t\t
282\tMELISA - Rate Report\tUnchanged\tBPM\tWidhi / Yudi\t\t
283\tMELISA - Rating Method\tUnchanged\tBPM\tWidhi / Yudi\t\t
284\tMELISA - Service Contract\tUnchanged\tBPM\tWidhi / Yudi\t\t
285\tMELISA - Surcharge 2025\tUnchanged\tBPM\tWidhi / Yudi\t\t
286\tMelisa - Training for SPU\tUnchanged\tBPM\tWidhi / Yudi\t\t
287\tMELISA - VAS Booking\tUnchanged\tBPM\tWidhi / Yudi\t\t
288\tMeratus's New Vision and Mission\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
289\tMQS: P3W Awareness\tUnchanged\tBPM\tWidyaphiana / Intan / Rina\t\t
290\tMSA - Management System & Data Base PBM\tUnchanged\tMSA\tArif Wibowo\t\t
291\tMSA - Pelatihan Dasar Pengoperasian Ruber TYRE GANTRY\tUnchanged\tMSA\tNovie Wancik\t\t
292\tMSA - Pelatihan Dasar Pengoperasian Side Loader Single Handler\tUnchanged\tMSA\tNovie Wancik\t\t
293\tMSA - Pelatihan Harbour Mobile Crane\tUnchanged\tMSA\tNovie Wancik\t\t
294\tMSA - Penanganan Container\tUnchanged\tMSA\tArif Wibowo\t\t
295\tMSA - Penanganan Reefer Container\tUnchanged\tMSA\tArif Wibowo\t\t
296\tMSA - Penanganan Uncontainerized\tUnchanged\tMSA\tArif Wibowo\t\t
297\tMSA - Penanggulangan Kebakaran dan Pengenalan APAR\tUnchanged\tMSA\tJaiz\t\t
298\tMSA - Pendapatan & Biaya PBM\tUnchanged\tMSA\tAnina\t\t
299\tMSA - Pengetahuan Bongkar Muat 2023\tUnchanged\tMSA\tArif Wibowo\t\t
300\tMSA - Pengetahuan Claim PBM\tUnchanged\tMSA\tArif Wibowo\t\t
301\tMSA - Pengetahuan Container\tUnchanged\tMSA\tArif Wibowo\t\t
302\tMSA - Pengetahuan Stowage Plan\tUnchanged\tMSA\tArif Wibowo\t\t
303\tMSA - Pengoperasian Dasar Ship to Shore\tUnchanged\tMSA\tNovie Wancik\t\t
304\tMSA - Perencanaan Bongkar Muat\tUnchanged\tMSA\tArif Wibowo\t\t
305\tMSA - Perencanaan Kebutuhan TKBM\tUnchanged\tMSA\tArif Wibowo\t\t
306\tMSA - Perencanaan Layout CY\tUnchanged\tMSA\tArif Wibowo\t\t
307\tMSA - Stacking Container di CY\tUnchanged\tMSA\tArif Wibowo\t\t
308\tMSM - Painting & Maintenance\tUnchanged\tMSM\tSeptian HPP\t\t
309\tMSM Machinery - 01 Aux Mach Fuel System - 2025\tUnchanged\tMSM\tSumarcatur RB\t\t
310\tMSM Machinery - 01 Engine Performance_Normal Operation\tUnchanged\tMSM\tSumarcatur RB\t\t
311\tMSM Machinery - 01 Engine Plan_Fuel System\tUnchanged\tMSM\tSumarcatur RB\t\t
312\tMSM Machinery - 02 Aux Mach Charge Air System\tUnchanged\tMSM\tSumarcatur RB\t\t
313\tMSM Machinery - 02 Engine Performance_Overload Engine Operation\tUnchanged\tMSM\tSumarcatur RB\t\t
314\tMSM Machinery - 02 Engine Plan_Charge Scavenge Air System\tUnchanged\tMSM\tSumarcatur RB\t\t
315\tMSM Machinery - 03 Engine Performance - Function of Collecting Data\tUnchanged\tMSM\tSumarcatur RB\t\t
316\tMSM Machinery - 03 Engine Plan_Compression System\tUnchanged\tMSM\tSumarcatur RB\t\t
317\tMSM Machinery - 04 Aux Mach_Refrigerator\tUnchanged\tMSM\tSumarcatur RB\t\t
318\tMSM Machinery - 04 Engine Performance - Heat Balance & Efficiency\tUnchanged\tMSM\tSumarcatur RB\t\t
319\tMSM Machinery - 04 Engine Plan_Starting Air System\tUnchanged\tMSM\tSumarcatur RB\t\t
320\tMSM Machinery - 05 Aux Mach_Controllable Pitch Propeller\tUnchanged\tMSM\tSumarcatur RB\t\t
321\tMSM Machinery - 05 Engine Performance_Monitoring of Engine Performance\tUnchanged\tMSM\tSumarcatur RB\t\t
322\tMSM Machinery - 05 Engine Plan_Cooling System\tUnchanged\tMSM\tSumarcatur RB\t\t
323\tMSM Machinery - 06 Aux Mach_Lubricating Oil System\tUnchanged\tMSM\tSumarcatur RB\t\t
324\tMSM Machinery - 06 Engine Plan_Lubricating System\tUnchanged\tMSM\tSumarcatur RB\t\t
325\tMSM Machinery - 07 Aux Mach_Cooling System\tUnchanged\tMSM\tSumarcatur RB\t\t
326\tMSM Machinery - 08 Aux Mach_Starting System\tUnchanged\tMSM\tSumarcatur RB\t\t
327\tMSM Machinery - 09 Aux Mach_Purification System\tUnchanged\tMSM\tSumarcatur RB\t\t
328\tMSM Marine - 01 Safety Of Life At Sea\tUnchanged\tMSM\tHarianto\t\t
329\tMSM Marine - 02 Marine Polution\tUnchanged\tMSM\tHarianto\t\t
330\tMSM Marine - 03 STCW 2010\tUnchanged\tMSM\tHarianto\t\t
331\tMSM Marine - 04 MLC 2006\tUnchanged\tMSM\tHarianto\t\t
332\tMSM Marine - 05 ISM Code\tUnchanged\tMSM\tHarianto\t\t
333\tMSM Marine - 06 ISPS Code\tUnchanged\tMSM\tHarianto\t\t
334\tMSM Marine - 07 Ballast Water Management\tUnchanged\tMSM\tHarianto\t\t
335\tMSM Marine - 08 Garbage Management\tUnchanged\tMSM\tHarianto\t\t
336\tMSM Marine - 09 Bridge Resource Management\tUnchanged\tMSM\tHarianto\t\t
337\tMSM Marine - 10 Safety Drill\tUnchanged\tMSM\tHarianto\t\t
338\tMSM Marine - 12 Class Survey & 13 Ship Certificates\tUnchanged\tMSM\tHarianto\t\t
339\tMSM Marine - 14 Crewing Management & Certificate\tUnchanged\tMSM\tHadi P\t\t
340\tMSM Marine - 15 UU Pelayaran\tUnchanged\tMSM\tHarianto\t\t
341\tNOVA - User Manual & Procedure\tUnchanged\tFinance\tFilemon/Marini\t\t
342\tOKR Certification: Leadership and Goal Setting (Module 1)\tUnchanged\tHRD\tMeratus Academy\t\t
343\tOKR Certification: Leadership and Goal Setting (Module 2)\tUnchanged\tHRD\tMeratus Academy\t\t
344\tOKR Certification: Leadership and Goal Setting (Module 3)\tUnchanged\tHRD\tMeratus Academy\t\t
345\tOKR Certification: Leadership and Goal Setting (Module 4)\tUnchanged\tHRD\tMeratus Academy\t\t
346\tPersonal Development - 15 Management Essential to Become Good Manager - 2024\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
347\tPersonal Development: Computer Posture\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
348\tPersonal Development: Etika Pergaulan\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
349\tProblem Solving (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
350\tProcurement - Basic Knowledge\tUnchanged\tProcurement\tRina Rahayu\t\t
351\tProcurement - D365 : Inventory Request dan Purchase Request\tUnchanged\tProcurement\tEndah Ungsi (Dessy)\t\t
352\tProcurement - D365 : Request for Quotation & Purchase Order\tUnchanged\tProcurement\tEndah Ungsi (Dessy)\t\t
353\tProcurement - Distribution Management\tUnchanged\tProcurement\tRina Rahayu\t\t
354\tProcurement - Finance for Non Finance\tUnchanged\tProcurement\tRina Rahayu\t\t
355\tProcurement - Inventory Management\tUnchanged\tProcurement\tEndah Ungsi (Dessy)\t\t
356\tProcurement - Warehouse Management\tUnchanged\tProcurement\tEndah Ungsi (Dessy)\t\t
357\tProcurement MSM - Econnect Flow & Functionalities\tUnchanged\tProcurement MSM\tFerry\t\t
358\tQuality Awareness\tUnchanged\tAsset & Charter\tDimas Wicaksono\t\t
359\tRisk Management for Level 12&Above\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
360\tRoot Cause Analysis for Level 10&Above\tUnchanged\tAsset & Charter\tMisbahul Munir\t\t
361\tSafety Leadership 2024\tUnchanged\tAsset & Charter\tDimas Wicaksono\t\t
362\tSistem Informasi Ketidaksesuaian dan Pengembangan (SIKaP)\tUnchanged\tBPM\tWidyaphiana / Naim\t\t
363\tSM - Docking Contract\tUnchanged\tMSM\tSeptian HPP\t\t
364\tSM - Docking D-12\tUnchanged\tMSM\tSeptian HPP\t\t
365\tSM - MariApps COMPASS Change Management\tUnchanged\tMSM\tM. Agung Maulana\t\t
366\tSM Docking Management - Module 1: Background and Introduction to Dry Docking\tUnchanged\tMSM\tSeptian HPP\t\t
367\tSM Docking Management - Module 2: Project Management\tUnchanged\tMSM\tSeptian HPP\t\t
368\tSM Docking Management - Module 3: Planning and Specification\tUnchanged\tMSM\tSeptian HPP\t\t
369\tSM Docking Management - Module 4: Tendering for Dry Dock Work\tUnchanged\tMSM\tSeptian HPP\t\t
370\tSM Docking Management - Module 5: Dry Dock Preparation, Execution, and Supervision\tUnchanged\tMSM\tSeptian HPP\t\t
371\tSM Docking Management - Module 6: Docking, Undocking and Completion of Project\tUnchanged\tMSM\tSeptian HPP\t\t
372\tSM Workshop - Generator\tUnchanged\tMSM\tRosanto\t\t
373\tSM Workshop - Global Maritime Distress Safety System\tUnchanged\tMSM\tRosanto\t\t
374\tSosialisasi Aktivasi & Registrasi CORETAX\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
375\tSosialisasi BPJS Kesehatan Segmen PPU\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
376\tSosialisasi BPJS Ketenagakerjaan - Manfaat Layanan BPJS\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
377\tStakeholder Management\tUnchanged\tHMM\tDamar\t\t
378\tThe Will to Perform (Malik)\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
379\tTrucking - Abnormality Monitoring\tUnchanged\tTrucking\tOperation Manager / P Yogi\t\t
380\tTrucking - Account Payable and DC Admin\tUnchanged\tTrucking\tAP / Mbak Rindik\t\t
381\tTrucking - Account Receivable and DC Admin\tUnchanged\tTrucking\tAR / Mas Sinar\t\t
382\tTrucking - Backlog Management\tUnchanged\tTrucking\tTechnical Supervisor / P Soni / Pak Tri\t\t
383\tTrucking - Basic Investigation & Root Cause Analysis\tUnchanged\tTrucking\tQSHE Corporate / P Yogi\t\t
384\tTrucking - Basic Monitoring by GPS\tUnchanged\tTrucking\tOperation Manager / P Yogi\t\t
385\tTrucking - Basic Transport Analyst\tUnchanged\tTrucking\tTransport Analysis / Mas Kresna\t\t
386\tTrucking - Basic Trucking Knowledge\tUnchanged\tTrucking\tOPS Man / Pak Tridarto\t\t
387\tTrucking - Business Offering (RFQ), Payment (Trip Cost, Fuel)\tUnchanged\tTrucking\tMas Sinar / Mbak Rindik\t\t
388\tTrucking - Business Overview\tUnchanged\tTrucking\tHead of Trucking / Pak Rifai\t\t
389\tTrucking - Control Tower\tUnchanged\tTrucking\tOperation Manager / P Yogi\t\t
390\tTrucking - Control Tower Reporting\tUnchanged\tTrucking\tOperation Manager / P Yogi\t\t
391\tTrucking - Daily Inspection (P2H)\tUnchanged\tTrucking\tTechnical Supervisor / P Soni / Pak Tri\t\t
392\tTrucking - Database Driver & Personnel Management\tUnchanged\tTrucking\tDriver Management / P. Yogi\t\t
393\tTrucking - Document Control\tUnchanged\tTrucking\tAP / Mb Rindik\t\t
394\tTrucking - Dokumen & Legalitas\tUnchanged\tTrucking\tGeneral Support / Mb Puput\t\t
395\tTrucking - Driver Management\tUnchanged\tTrucking\tDriver Management / P. Yogi\t\t
396\tTrucking - Driver Performance & Evaluation\tUnchanged\tTrucking\tDriver Management / P. Yogi\t\t
397\tTrucking - Driver Regulation & Compliance\tUnchanged\tTrucking\tDriver Management / P. Yogi\t\t
398\tTrucking - Inventory Management\tUnchanged\tTrucking\tInventory Support / P Ery\t\t
399\tTrucking - Maintenance Planning & Scheduling\tUnchanged\tTrucking\tTechnical Supervisor / P Soni / Pak Tri\t\t
400\tTrucking - MJT Operation Overview\tUnchanged\tTrucking\tOPS Man / Pak Tridarto\t\t
401\tTrucking - QSHE Operational Trucking\tUnchanged\tTrucking\tDriver Management / Pak Yogi\t\t
402\tTrucking - Recruitment & Screening Driver\tUnchanged\tTrucking\tDriver Management / P. Yogi\t\t
403\tTrucking - Risk Assesment & HIRADC\tUnchanged\tTrucking\tQSHE Corporate / P Yogi\t\t
404\tTrucking - Road Hazard Mapping\tUnchanged\tTrucking\tQSHE Corporate / P Yogi\t\t
405\tTrucking - Safety Analysis & Proactive Risk Identification\tUnchanged\tTrucking\tQSHE Corporate / P Yogi\t\t
406\tTrucking - Safety Observation Card\tUnchanged\tTrucking\tQSHE Corporate / P Yogi\t\t
407\tTrucking - Warehouse Management\tUnchanged\tTrucking\tInventory Support / P Ery\t\t
408\tTutorial Pelaporan SPT Tahunan Karyawan dan Pemadanan NIK-NPWP\tUnchanged\tMeratus Academy\tMeratus Academy\t\t
409\tVendor Management: VMT and Sales Guidance\tUnchanged\tLogistics\tHenry Limanto & Agnes Mega Arista\t\t`

// HRBP MAPPING LOGIC 
const getHRBP = (sbu: string) => {
  const s = (sbu || '').toLowerCase();
  if (s.includes('asset') || s.includes('charter')) return 'Akbar';
  if (s.includes('hmm')) return 'Arum';
  if (s.includes('corp') || s.includes('fin') || s.includes('acc') || s.includes('ga') || s.includes('hmm') || s.includes('hr') || s.includes('internal audit') || s.includes('legal') || s.includes('procurement')) return 'Sherly';
  if (s.includes('bpm') || s.includes('it')) return 'Berhard';
  if (s.includes('crewing') || s.includes('msm')) return 'Sentra';
  if (s.includes('academy')) return 'Beva';
  if (s.includes('commercial') || s.includes('operation') || s.includes('trade') || s.includes('logistic') || s.includes('trucking')) return 'Taufik';
  if (s.includes('mtm') || s.includes('terminal') || s.includes('clc') || s.includes('msa')) return 'Ronny';
  return 'Unassigned';
};

const GlobalSuggestionInput = ({ value, setValue, placeholder, list, icon: Icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full sm:w-48 lg:w-56 flex-shrink-0" ref={ref}>
      <div className="relative flex items-center group">
        <Icon className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-9 pr-8 py-1.5 h-[32px] bg-white border border-slate-300 shadow-sm rounded-lg text-[10px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          value={value}
          onChange={(e: any) => { setValue(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
        />
        {value && (
          <button type="button" onClick={() => setValue("")} className="absolute right-2 p-1 hover:bg-slate-100 rounded-full transition-colors z-10">
            <X size={12} className="text-slate-400" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2">
          {list
            .filter((i: string) => i.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 30)
            .map((item: string, i: number) => (
              <button 
                key={i} 
                type="button"
                className="w-full text-left px-4 py-2.5 text-[11px] hover:bg-slate-50 text-slate-700 font-bold transition-colors border-b last:border-0 border-slate-100 uppercase"
                onClick={(e: any) => { 
                  e.preventDefault(); 
                  setValue(item); 
                  setIsOpen(false); 
                }}
              >
                {item}
              </button>
            ))
          }
          {list.filter((i: string) => i.toLowerCase().includes(value.toLowerCase())).length === 0 && (
             <div className="px-4 py-3 text-xs text-slate-500 font-medium italic text-center">No match found</div>
          )}
        </div>
      )}
    </div>
  );
};

// Inline Editable Cell Component
const EditableCell = ({ value, onSave, className, isLink, isTextArea = false }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !isTextArea) {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (isTextArea) {
      return (
        <textarea
          autoFocus
          value={localValue}
          onChange={e => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-white border border-blue-500 rounded px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-[10px] text-slate-800 font-medium shadow-sm resize-y min-h-[60px] custom-scrollbar"
        />
      );
    }
    return (
      <input
        autoFocus
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full bg-white border border-blue-500 rounded px-1.5 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-[10px] text-slate-800 font-medium shadow-sm"
      />
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)} 
      className={`cursor-text hover:bg-blue-50 hover:border-blue-200 border border-transparent px-1.5 py-1 rounded transition-colors min-h-[24px] flex ${isTextArea ? 'items-start' : 'items-center'} break-words ${className}`}
      title="Click to edit"
    >
      {value ? (isLink ? <span className="truncate max-w-[150px] inline-block">{value}</span> : value) : <span className="text-slate-300 italic text-[9px]">Empty</span>}
    </div>
  );
};

// Helper: Convert Intern Status for Main UI Display
const getShortInternStatus = (status: string) => {
  if (!status) return 'PROG: SME';
  if (status === 'Progress by Celine') return 'PROG: CELINE';
  if (status === 'Progress by Diana') return 'PROG: DIANA';
  if (status === 'Progress by SME') return 'PROG: SME';
  if (status === 'Checked by Celine') return 'CHK: CELINE'; 
  if (status === 'Checked by Diana') return 'CHK: DIANA';   
  if (status === 'Checked by SME') return 'CHK: SME';       
  return status.toUpperCase().substring(0, 15);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [moduleView, setModuleView] = useState('active'); 

  const [sortOrder, setSortOrder] = useState('default'); 
  const [rawData, setRawData] = useState(DEFAULT_TSV);
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Filter States
  const [searchFilter, setSearchFilter] = useState("");
  const [sbuFilter, setSbuFilter] = useState("");
  const [hrbpFilter, setHrbpFilter] = useState("");

  // Add Module
  const [showAddModule, setShowAddModule] = useState(false);
  const [addModuleError, setAddModuleError] = useState('');
  const [newModule, setNewModule] = useState({
    name: '',
    status: 'On Progress',
    sbu: '',
    hrbp: '',
    sme: '',
    material: 'No',
    test: 'No',
    studyCase: 'No',
    linkNew: '',
    linkOld: '',
    notes: ''
  });

  // FIREBASE INIT
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err: any) { 
        console.error("Firebase Auth Error:", err); 
        setSyncError("Auth Fail"); 
        setIsLoadingData(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      if (!u) setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
    const unsubscribe = onSnapshot(docRef, (docSnap: any) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (typeof data.tsvData === 'string') {
          setRawData(data.tsvData);
        }
      }
      setIsLoadingData(false);
      setSyncError(null);
    }, (err: any) => {
      console.error("Firestore Sync Error:", err); 
      setSyncError("Sync Fail");
      setIsLoadingData(false);
    });
    return () => unsubscribe();
  }, [user]);

  const parsedData = useMemo(() => {
    if (!rawData || rawData.trim() === '') return []; 
    const lines = rawData.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    const allRows = lines.slice(1).reduce((acc: any[], line: string, idx: number) => {
      if (!line || line.trim() === '') return acc;

      const values = line.split('\t');
      const obj: Record<string, any> = {};
      headers.forEach((header: string, i: number) => { obj[header] = values[i] ? values[i].trim() : ''; });
      
      const rawStatus = (obj['Status'] || '').toLowerCase();

      // Status Normalization
      if (rawStatus.includes('final')) obj._normStatus = 'Final';
      else if (rawStatus.includes('diperbarui') || rawStatus.includes('updated') || rawStatus.includes('checked')) obj._normStatus = 'Checked';
      else if (rawStatus.includes('archived') || rawStatus.includes('no edit') || rawStatus.includes('tidak perlu') || rawStatus.includes('exclude')) obj._normStatus = 'Archived';
      else obj._normStatus = 'On Progress';

      obj._linkNew = obj['Link Terbaru'] || null;
      obj._linkOld = obj['Link File Lama'] || null;
      obj._order = parseInt(obj['No'] || obj['NO']) || 0;
      obj._originalIndex = idx + 1;

      // Extract new Checklist/SME Fields 
      const isReadyOrFinal = obj._normStatus === 'Checked' || obj._normStatus === 'Final';
      
      obj['SME'] = obj['SME'] || '';
      obj['Material'] = obj['Material'] || (isReadyOrFinal ? 'Yes' : 'No');
      obj['Test'] = obj['Test'] || (isReadyOrFinal ? 'Yes' : 'No');
      obj['Study Case'] = obj['Study Case'] || 'No'; // default selalu No untuk study case
      
      // SMART EXTRACTION FOR EMPTY SBU
      let sbu = obj['Group SBU/SFU'] || '';
      if (!sbu && obj['Nama Module']) {
          if (obj['Nama Module'].includes(' - ')) {
              sbu = obj['Nama Module'].split(' - ')[0].trim();
          } else if (obj['Nama Module'].includes(' : ')) {
              sbu = obj['Nama Module'].split(' : ')[0].trim();
          } else if (obj['Nama Module'].includes(':')) {
              sbu = obj['Nama Module'].split(':')[0].trim();
          }
          obj['Group SBU/SFU'] = sbu;
      }

      // Auto Assign HRBP
      obj._hrbp = obj['HRBP'] || getHRBP(sbu);

      // Defaulting Intern Status dynamically if not present
      let internStateRaw = obj['Intern Status'] || '';
      if (!internStateRaw) {
         if (obj._normStatus === 'Checked') obj._internStatus = 'Checked by SME';
         else obj._internStatus = 'Progress by SME';
      } else {
         obj._internStatus = internStateRaw;
      }

      if (obj['Nama Module']) acc.push(obj);
      return acc;
    }, []); 

    const uniqueModulesMap = new Map();
    const statusPriority: any = { 'Final': 4, 'Checked': 3, 'On Progress': 2, 'Archived': 1 };
    
    allRows.forEach((row: any) => {
      const titleKey = row['Nama Module'].trim().toLowerCase();
      if (uniqueModulesMap.has(titleKey)) {
        const existing = uniqueModulesMap.get(titleKey);
        if (statusPriority[row._normStatus] > statusPriority[existing._normStatus]) {
          uniqueModulesMap.set(titleKey, row);
        } else if (row._normStatus === existing._normStatus) {
          uniqueModulesMap.set(titleKey, row);
        }
      } else {
        uniqueModulesMap.set(titleKey, row);
      }
    });

    return Array.from(uniqueModulesMap.values());
  }, [rawData]);

  const suggestions = useMemo(() => ({
    names: [...new Set(parsedData.map((d: any) => d['Nama Module']).filter(Boolean))].sort(),
    sbus: [...new Set(parsedData.map((d: any) => d['Group SBU/SFU']).filter(Boolean))].sort(),
    hrbps: [...new Set(parsedData.map((d: any) => d._hrbp).filter(Boolean))].sort()
  }), [parsedData]);

  const globallyFilteredData = useMemo(() => {
    let data = parsedData;
    if (searchFilter) {
      const lowerSearch = searchFilter.toLowerCase();
      data = data.filter((d: any) => (d['Nama Module'] || '').toLowerCase().includes(lowerSearch));
    }
    if (sbuFilter) data = data.filter((d: any) => (d['Group SBU/SFU'] || '').toLowerCase().includes(sbuFilter.toLowerCase()));
    if (hrbpFilter) data = data.filter((d: any) => (d._hrbp || '').toLowerCase().includes(hrbpFilter.toLowerCase()));
    return data;
  }, [parsedData, searchFilter, sbuFilter, hrbpFilter]);

  const metrics = useMemo(() => {
    const data = globallyFilteredData;
    let checkedCount = 0, finalCount = 0, unchangedCount = 0, archivedCount = 0;
    let activeTotal = 0; 
    let celineProg = 0, celineChk = 0, dianaProg = 0, dianaChk = 0;

    const sbuMap: Record<string, any> = {};

    data.forEach((d: any) => {
      const sbu = d['Group SBU/SFU'] || 'Unknown SBU';
      
      if (!sbuMap[sbu]) sbuMap[sbu] = { name: sbu, total: 0, activeTotal: 0, checked: 0, final: 0, hrbp: d._hrbp };
      sbuMap[sbu].total += 1;

      if (d._normStatus === 'Archived') {
        archivedCount++;
      } else {
        activeTotal++;
        sbuMap[sbu].activeTotal += 1;
        
        if (d._normStatus === 'Final') {
          finalCount++;
          sbuMap[sbu].final += 1;
        } else if (d._normStatus === 'Checked') {
          checkedCount++;
          sbuMap[sbu].checked += 1;
        } else if (d._normStatus === 'On Progress') {
          unchangedCount++;
        }

        // Intern specific metrics
        const iStatus = d._internStatus;
        if (iStatus === 'Progress by Celine') celineProg++;
        else if (iStatus === 'Checked by Celine') celineChk++;
        else if (iStatus === 'Progress by Diana') dianaProg++;
        else if (iStatus === 'Checked by Diana') dianaChk++;
      }
    });
    
    const sbuSummary = Object.values(sbuMap)
      .map((s: any) => ({
        ...s,
        activityScore: s.checked + (s.final * 2)
      }))
      .sort((a: any, b: any) => b.activityScore - a.activityScore);

    const checkRate = activeTotal > 0 ? (((checkedCount + finalCount) / activeTotal) * 100).toFixed(1) : 0;

    return {
      total: data.length, 
      activeTotal, 
      checkedCount, 
      finalCount, 
      unchangedCount, 
      archivedCount, 
      checkRate, 
      sbuSummary,
      celineProg, celineChk, dianaProg, dianaChk
    };
  }, [globallyFilteredData]);

  const tableData = useMemo(() => {
    let baseData = globallyFilteredData;
    
    if (moduleView === 'final') baseData = baseData.filter((d: any) => d._normStatus === 'Final');
    else if (moduleView === 'checked') baseData = baseData.filter((d: any) => d._normStatus === 'Checked');
    else if (moduleView === 'on_progress') baseData = baseData.filter((d: any) => d._normStatus === 'On Progress');
    else if (moduleView === 'archived') baseData = baseData.filter((d: any) => d._normStatus === 'Archived');
    else if (moduleView === 'active') baseData = baseData.filter((d: any) => d._normStatus !== 'Archived'); 
    else if (moduleView === 'celine') baseData = baseData.filter((d: any) => (d._internStatus || '').includes('Celine') && d._normStatus !== 'Archived');
    else if (moduleView === 'diana') baseData = baseData.filter((d: any) => (d._internStatus || '').includes('Diana') && d._normStatus !== 'Archived');

    if (sortOrder === 'default') baseData = [...baseData].sort((a: any, b: any) => a._order - b._order);
    else if (sortOrder === 'az') baseData = [...baseData].sort((a: any, b: any) => (a['Nama Module'] || '').localeCompare(b['Nama Module'] || ''));
    else if (sortOrder === 'za') baseData = [...baseData].sort((a: any, b: any) => (b['Nama Module'] || '').localeCompare(a['Nama Module'] || ''));
    return baseData;
  }, [globallyFilteredData, moduleView, sortOrder]);

  const handleSaveToCloud = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
      await setDoc(docRef, { tsvData: rawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
    } catch (e: any) { 
      console.error("Save Document Error:", e);
      setSyncError("Save Failed"); 
    }
    finally { setIsSaving(false); }
  };

  const handleExportTable = () => {
    const b = new Blob([rawData], { type: 'text/tsv' }); 
    const u = URL.createObjectURL(b); 
    const a = document.createElement('a'); a.href = u; a.download = 'CCT_Module_Tracker_Raw.tsv'; a.click();
  };

  // ==========================================
  // BEST VISUALIZATION EXCEL EXPORT (EXCELJS)
  // ==========================================
  const handleExportExcel = async () => {
    if (tableData.length === 0) return;
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CCT Modules Tracker';
    workbook.created = new Date();

    // ----------------------------------------------------
    // SHEET 1: DATA DETAIL
    // ----------------------------------------------------
    const wsData = workbook.addWorksheet('Module Data Detail');
    
    // Define columns
    wsData.columns = [
      { header: 'No', key: 'no', width: 6 },
      { header: 'Nama Module', key: 'nama', width: 50 },
      { header: 'Status (Main)', key: 'status', width: 22 },
      { header: 'Group SBU/SFU', key: 'sbu', width: 25 },
      { header: 'HRBP PIC', key: 'hrbp', width: 15 },
      { header: 'SME', key: 'sme', width: 25 },
      { header: 'Material Ready?', key: 'mat', width: 16 },
      { header: 'Test Ready?', key: 'test', width: 15 },
      { header: 'Study Case Ready?', key: 'case', width: 18 },
      { header: 'Intern Status', key: 'istatus', width: 25 },
      { header: 'Intern Progress (%)', key: 'iprog', width: 20 },
      { header: 'Link Terbaru', key: 'lnew', width: 45 },
      { header: 'Link File Lama', key: 'lold', width: 45 },
      { header: 'Notes', key: 'notes', width: 60 }
    ];

    // Add rows
    tableData.forEach((row: any) => {
      wsData.addRow({
        no: row['No'] || row['NO'],
        nama: row['Nama Module'],
        status: row._normStatus,
        sbu: row['Group SBU/SFU'],
        hrbp: row._hrbp,
        sme: row['SME'] || '-',
        mat: row['Material'] === 'Yes' ? 'Yes' : 'No',
        test: row['Test'] === 'Yes' ? 'Yes' : 'No',
        case: row['Study Case'] === 'Yes' ? 'Yes' : 'No',
        istatus: row._internStatus,
        iprog: row['Intern Progress'] || '0',
        lnew: row._linkNew || '-',
        lold: row._linkOld || '-',
        notes: row['Notes'] || '-'
      });
    });

    // Style Header Sheet 1
    wsData.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Putih
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } }; // Slate-900 (Gelap Elegan)
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });

    // Style Body Rows Sheet 1 (Zebra Striping, Wrap text)
    wsData.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell(cell => {
          cell.alignment = { vertical: 'middle', wrapText: true };
          cell.border = { 
            top: {style:'thin', color: {argb:'FFE2E8F0'}}, 
            left: {style:'thin', color: {argb:'FFE2E8F0'}}, 
            bottom: {style:'thin', color: {argb:'FFE2E8F0'}}, 
            right: {style:'thin', color: {argb:'FFE2E8F0'}} 
          };
        });
        // Selang seling warna abu-abu tipis
        if (rowNumber % 2 === 0) {
           row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }
      }
    });

    // ----------------------------------------------------
    // SHEET 2: ANALYSIS & SUMMARY
    // ----------------------------------------------------
    const wsAnalysis = workbook.addWorksheet('Analysis & Summary');
    
    wsAnalysis.columns = [
       { header: 'SBU / SFU', key: 'sbu', width: 35 },
       { header: 'HRBP PIC', key: 'hrbp', width: 18 },
       { header: 'Total Library', key: 'total', width: 15 },
       { header: 'Active Modules', key: 'active', width: 16 },
       { header: 'Checked', key: 'ready', width: 22 },
       { header: 'Finalized', key: 'final', width: 15 },
       { header: 'On Progress', key: 'prog', width: 15 }
    ];

    metrics.sbuSummary.forEach((sbu: any) => {
       wsAnalysis.addRow({
          sbu: sbu.name,
          hrbp: sbu.hrbp,
          total: sbu.total,
          active: sbu.activeTotal,
          ready: sbu.checked,
          final: sbu.final,
          prog: sbu.activeTotal - (sbu.checked + sbu.final)
       });
    });

    // Style Header Sheet 2
    wsAnalysis.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } }; // Blue-700 (Biru cerah)
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
    });

    // Style Body Rows Sheet 2
    wsAnalysis.eachRow((row, rowNumber) => {
      if(rowNumber > 1) {
        row.eachCell((cell, colNumber) => {
          // Center number columns
          if(colNumber > 2) cell.alignment = { vertical: 'middle', horizontal: 'center' };
          else cell.alignment = { vertical: 'middle' };
          
          cell.border = { 
            top: {style:'thin', color:{argb:'FFCBD5E1'}}, 
            left: {style:'thin', color:{argb:'FFCBD5E1'}}, 
            bottom: {style:'thin', color:{argb:'FFCBD5E1'}}, 
            right: {style:'thin', color:{argb:'FFCBD5E1'}} 
          };
        });
      }
    });

    // Execute Download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `CCT_Modules_Tracker_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const clearAllFilters = () => { setSearchFilter(""); setSbuFilter(""); setHrbpFilter(""); };

  // CORE TSV UPDATE FUNCTION (SUPPORTS MULTIPLE COLUMN UPDATES AT ONCE)
  const handleMultipleCellEdits = async (originalIndex: number, updates: Record<string, string>) => {
    const lines = rawData.split(/\r?\n/);
    if (!lines[0]) return;
    const headers = lines[0].split('\t').map((h: string) => h.trim());
    
    const targetLine = lines[originalIndex];
    if (targetLine === undefined) return;
    
    const values = targetLine.split('\t');
    
    Object.entries(updates).forEach(([headerFallback, newValue]) => {
        let headerIndex = headers.indexOf(headerFallback);
        if (headerIndex === -1 && headerFallback.toLowerCase() === 'no') {
            headerIndex = headers.findIndex(h => h.toLowerCase() === 'no');
        }
        
        if (headerIndex === -1) {
            headers.push(headerFallback);
            lines[0] = headers.join('\t');
            headerIndex = headers.length - 1;
        }

        while(values.length <= headerIndex) values.push('');
        values[headerIndex] = newValue;
    });

    lines[originalIndex] = values.join('\t');
    const newRawData = lines.join('\n');
    setRawData(newRawData);

    if (user) {
      setIsSaving(true);
      try {
        const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
        await setDoc(docRef, { tsvData: newRawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
      } catch (e: any) { 
        console.error("Auto-Save Document Error:", e);
        setSyncError("Auto-Save Failed"); 
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Wrapper for Single cell edit
  const handleCellEdit = (originalIndex: number, headerFallback: string, newValue: string) => {
    handleMultipleCellEdits(originalIndex, { [headerFallback]: newValue });
  };

  const resetAddModuleForm = () => {
    setNewModule({
      name: '', status: 'On Progress', sbu: '', hrbp: '', sme: '',
      material: 'No', test: 'No', studyCase: 'No',
      linkNew: '', linkOld: '', notes: ''
    });
    setAddModuleError('');
  };

  const closeAddModule = () => {
    setShowAddModule(false);
    resetAddModuleForm();
  };

  const handleAddModule = async () => {
    const moduleName = newModule.name.trim();
    if (!moduleName) {
      setAddModuleError('Nama module wajib diisi.');
      return;
    }
    if (parsedData.some((row: any) => (row['Nama Module'] || '').trim().toLowerCase() === moduleName.toLowerCase())) {
      setAddModuleError('Nama module sudah terdaftar. Gunakan nama yang berbeda.');
      return;
    }

    const sanitize = (value: string) => (value || '').replace(/[\t\r\n]+/g, ' ').trim();
    const lines = rawData.trimEnd().split(/\r?\n/);
    const headers = lines[0].split('\t').map((header: string) => header.trim());
    const requiredHeaders = [
      'No', 'Nama Module', 'Status', 'Group SBU/SFU', 'HRBP', 'SME',
      'Material', 'Test', 'Study Case', 'Link Terbaru', 'Link File Lama',
      'Notes', 'Intern Status'
    ];

    requiredHeaders.forEach((header) => {
      if (!headers.some((existing) => existing.toLowerCase() === header.toLowerCase())) headers.push(header);
    });
    lines[0] = headers.join('\t');

    const maxNo = parsedData.reduce((max: number, row: any) => {
      const current = parseInt(row['No'] || row['NO']) || 0;
      return Math.max(max, current);
    }, 0);
    const rowData: Record<string, string> = {
      'No': String(maxNo + 1),
      'Nama Module': moduleName,
      'Status': newModule.status,
      'Group SBU/SFU': sanitize(newModule.sbu),
      'HRBP': sanitize(newModule.hrbp) || getHRBP(newModule.sbu),
      'SME': sanitize(newModule.sme),
      'Material': newModule.material,
      'Test': newModule.test,
      'Study Case': newModule.studyCase,
      'Link Terbaru': sanitize(newModule.linkNew),
      'Link File Lama': sanitize(newModule.linkOld),
      'Notes': sanitize(newModule.notes),
      'Intern Status': newModule.status === 'Checked' || newModule.status === 'Final' ? 'Checked by SME' : 'Progress by SME'
    };
    const newRow = headers.map((header) => {
      const matchedKey = Object.keys(rowData).find((key) => key.toLowerCase() === header.toLowerCase());
      return matchedKey ? rowData[matchedKey] : '';
    }).join('\t');
    const newRawData = [...lines, newRow].join('\n');

    setRawData(newRawData);
    setIsSaving(true);
    try {
      if (!user) throw new Error('Cloud connection is not ready');
      const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
      await setDoc(docRef, { tsvData: newRawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
      setModuleView('all');
      closeAddModule();
    } catch (e: any) {
      console.error('Add Module Error:', e);
      setSyncError('Add Module Failed');
      setAddModuleError('Module belum berhasil disimpan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete every stored row for a displayed module, including hidden duplicate names.
  const handleDeleteModule = async (moduleName: string) => {
    if (!user || isSaving) return;
    const lines = rawData.split(/\r?\n/);
    const nameIndex = lines[0]?.split('\t').findIndex((header: string) => header.trim().toLowerCase() === 'nama module') ?? -1;
    if (nameIndex < 0) {
      setSyncError('Delete Module Failed');
      return;
    }

    const matches = (line: string) => (line.split('\t')[nameIndex] || '').trim().toLowerCase() === moduleName.trim().toLowerCase();
    const count = lines.slice(1).filter(matches).length;
    if (!count) return;
    if (!window.confirm(`Hapus module "${moduleName}" secara permanen?${count > 1 ? ` (${count} baris dengan nama yang sama akan dihapus.)` : ''}\n\nTindakan ini akan menghapusnya dari data cloud dan tidak dapat dibatalkan.`)) return;

    const newRawData = [lines[0], ...lines.slice(1).filter((line: string) => !matches(line))].join('\n');
    setIsSaving(true);
    try {
      const docRef = doc(db, 'dashboard', 'module_tracker_data_v2');
      await setDoc(docRef, { tsvData: newRawData, updatedAt: new Date().toISOString(), updatedBy: user.uid });
      setRawData(newRawData);
      setSyncError(null);
    } catch (e: any) {
      console.error('Delete Module Error:', e);
      setSyncError('Delete Module Failed');
      window.alert('Module belum berhasil dihapus. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-200 selection:text-blue-900 flex flex-col overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="h-[48px] bg-white text-slate-800 shadow-sm border-b border-slate-200 flex-shrink-0 z-50">
        <div className="h-full w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-lg shadow-md">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-[12px] tracking-tight uppercase leading-tight text-slate-800">CCT Modules <span className="text-blue-600">Tracker</span></h1>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncError ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{syncError || 'Cloud Sync Active'}</p>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[ 
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'modules', label: 'Detail View', icon: TableProperties },
              { id: 'intern', label: 'Intern Tracker', icon: GraduationCap },
              { id: 'source', label: 'Source Data', icon: Upload }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <tab.icon size={11}/> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* FILTER BAR */}
      {(activeTab === 'dashboard' || activeTab === 'modules' || activeTab === 'intern') && (
        <div className="h-[44px] bg-white border-b border-slate-100 flex-shrink-0 z-40 shadow-sm">
           <div className="h-full w-full px-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 mr-1 shrink-0">
                 <Filter size={12} className="text-blue-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">Global Filters:</span>
              </div>
              <div className="flex gap-2 flex-1 sm:flex-none">
                <GlobalSuggestionInput value={hrbpFilter} setValue={setHrbpFilter} placeholder="Filter HRBP..." list={suggestions.hrbps} icon={Users} />
                <GlobalSuggestionInput value={sbuFilter} setValue={setSbuFilter} placeholder="Filter SBU/SFU..." list={suggestions.sbus} icon={Building2} />
                <GlobalSuggestionInput value={searchFilter} setValue={setSearchFilter} placeholder="Search Module Name..." list={suggestions.names} icon={Search} />
              </div>
              {(searchFilter || sbuFilter || hrbpFilter) && (
                <button onClick={clearAllFilters} className="text-[8px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-rose-100 shadow-sm ml-auto transition-colors hover:bg-rose-100 shrink-0">
                  <X size={10} /> Clear
                </button>
              )}
           </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full overflow-hidden p-3 sm:p-4 bg-[#F8FAFC]">
        {isLoadingData ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400"><RefreshCw className="h-8 w-8 animate-spin mb-3 text-blue-500" /><p className="font-bold text-[10px] tracking-widest uppercase animate-pulse">Synchronizing Data...</p></div>
        ) : activeTab === 'dashboard' ? (
          
          <div className="h-full flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Top Stat Cards - Compact View */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
              {[
                { label: 'Active Modules', val: metrics.activeTotal, subVal: `TOTAL: ${metrics.total}`, color: 'blue', icon: BookOpen, targetView: 'all' },
                { label: 'Checked', val: metrics.checkedCount, color: 'indigo', icon: CheckCircle2, targetView: 'checked' },
                { label: 'Final', val: metrics.finalCount, color: 'emerald', icon: ShieldCheck, targetView: 'final' },
                { label: 'On Progress', val: metrics.unchangedCount, color: 'amber', icon: History, targetView: 'on_progress' },
                { label: 'No Edit', val: metrics.archivedCount, color: 'slate', icon: EyeOff, targetView: 'archived' },
                { label: 'Check Rate', val: `${metrics.checkRate}%`, color: 'sky', icon: Activity, targetView: 'active' }
              ].map((card, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                     setModuleView(card.targetView);
                     setActiveTab('modules');
                  }}
                  className={`cursor-pointer bg-white p-3 rounded-2xl border-l-4 border-l-${card.color}-500 border-y border-r border-slate-200 shadow-sm flex flex-col justify-between h-[64px] relative overflow-hidden group hover:shadow-md hover:border-${card.color}-300 transition-all`}
                  title={`Click to view in Details`}
                >
                  <div className="flex justify-between items-start z-10">
                    <h3 className={`text-[9px] font-black text-${card.color}-600 uppercase tracking-widest`}>{card.label}</h3>
                    <card.icon size={12} className={`text-${card.color}-500 opacity-60`} />
                  </div>
                  <div className="flex flex-col z-10 mt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">{card.val}</span>
                      {card.subVal && <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{card.subVal}</span>}
                    </div>
                  </div>
                  <div className={`absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform`}><card.icon size={45} /></div>
                </div>
              ))}
            </div>

            {/* SBU Tracking Grid */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col min-h-0 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-500" size={14} />
                  <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">SBU / SFU Progress Tracking</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> CHECKED</span>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> FINAL</span>
                </div>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {metrics.sbuSummary.map((sbu: any, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        setSbuFilter(sbu.name);
                        setActiveTab('modules');
                      }}
                      className="cursor-pointer bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1.5 hover:border-blue-400 hover:shadow-md transition-all group"
                      title={`Filter table by SBU: ${sbu.name}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black text-slate-800 truncate block uppercase leading-tight group-hover:text-blue-600 transition-colors">{sbu.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest" title={`Active Modul: ${sbu.activeTotal} dari Total Keseluruhan: ${sbu.total}`}>
                           {sbu.activeTotal} Active <span className="text-slate-300">/ {sbu.total}</span>
                         </span>
                         <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1"><Users size={8} /> {sbu.hrbp}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                          <span className="text-indigo-600">Chk: {sbu.checked}</span>
                          <span className="text-emerald-600">Fin: {sbu.final}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex shadow-inner">
                          <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-full" style={{ width: `${sbu.activeTotal > 0 ? (sbu.checked / sbu.activeTotal) * 100 : 0}%` }}></div>
                          <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full" style={{ width: `${sbu.activeTotal > 0 ? (sbu.final / sbu.activeTotal) * 100 : 0}%` }}></div>
                        </div>
                      </div>

                    </div>
                  ))}
                  {metrics.sbuSummary.length === 0 && (
                    <div className="col-span-full text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-widest">No data matching current filters.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        ) : activeTab === 'modules' ? (
          
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50/50 shrink-0">
                <div className="flex overflow-x-auto no-scrollbar flex-1 p-1">
                  {[
                    { id: 'all', label: 'Total (Library)', count: metrics.total, color: 'slate' },
                    { id: 'active', label: 'Active Only', count: metrics.activeTotal, color: 'blue' },
                    { id: 'checked', label: 'Checked', count: metrics.checkedCount, color: 'indigo' },
                    { id: 'final', label: 'Final', count: metrics.finalCount, color: 'emerald' },
                    { id: 'on_progress', label: 'On Progress', count: metrics.unchangedCount, color: 'amber' },
                    { id: 'archived', label: 'No Edit', count: metrics.archivedCount, color: 'slate' }
                  ].map(v => (
                    <button key={v.id} onClick={() => setModuleView(v.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${moduleView === v.id ? `bg-white text-${v.color}-600 shadow-sm border border-slate-200` : 'text-slate-400 hover:text-slate-800'}`}>
                      {v.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full bg-${v.color}-50 text-${v.color}-600 text-[8px]`}>{v.count}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center px-4 py-2 md:py-0 border-t md:border-t-0 border-slate-200 gap-2 shrink-0 bg-white md:bg-transparent">
                  <select value={sortOrder} onChange={(e: any) => setSortOrder(e.target.value)} className="bg-white border border-slate-300 text-slate-700 text-[9px] font-black uppercase rounded-lg px-2 h-[32px] outline-none shadow-sm">
                    <option value="default">Default Sort</option>
                    <option value="az">A-Z Name</option>
                    <option value="za">Z-A Name</option>
                  </select>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 ml-1">
                    <button onClick={() => { resetAddModuleForm(); setShowAddModule(true); }} disabled={isSaving || !user} className="text-[9px] font-black text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70" title="Add a new module">
                      <Plus size={12}/> Add Module
                    </button>
                    <button onClick={handleSaveToCloud} disabled={isSaving || !user} className="text-[9px] font-black text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-70" title="Sync Changes to Cloud">
                      {isSaving ? <RefreshCw size={11} className="animate-spin" /> : <Save size={11}/>} Sync
                    </button>
                    <button onClick={handleExportExcel} className="text-[9px] font-black text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-md transition-all active:scale-95" title="Export Dashboard Data & Analysis to Excel">
                      <FileSpreadsheet size={12}/> Excel
                    </button>
                    <button onClick={handleExportTable} className="text-[9px] font-black text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 uppercase tracking-widest px-3 h-[32px] rounded-lg shadow-sm transition-all active:scale-95" title="Export Raw Data">
                      <Download size={11}/> TSV
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-5 py-3 w-10 text-center">NO</th>
                      <th className="px-5 py-3 min-w-[250px]">Nama Module</th>
                      <th className="px-4 py-3 text-center">Status (Sync)</th>
                      <th className="px-4 py-3">Group SBU</th>
                      <th className="px-4 py-3 text-center">HRBP</th>
                      <th className="px-4 py-3 min-w-[150px]">SME</th>
                      <th className="px-3 py-3 text-center" title="Materi Sudah Siap?">Material</th>
                      <th className="px-3 py-3 text-center" title="Test/Quiz Sudah Siap?">Test</th>
                      <th className="px-3 py-3 text-center" title="Study Case Sudah Siap?">Case</th>
                      <th className="px-5 py-3 text-center min-w-[150px]">Akses (Files)</th>
                      <th className="px-5 py-3 min-w-[200px]">Notes</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableData.map((row: any, idx: number) => {
                      const shortInternText = getShortInternStatus(row._internStatus);
                      
                      return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-2.5">
                          <EditableCell 
                            value={row['No'] || row['NO']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, row['NO'] !== undefined ? 'NO' : 'No', val)}
                            className="text-center font-bold text-slate-400 justify-center"
                          />
                        </td>
                        <td className="px-5 py-2.5">
                          <EditableCell 
                            value={row['Nama Module']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Nama Module', val)}
                            className="font-black text-slate-800 uppercase"
                          />
                        </td>
                        <td className="px-4 py-2.5 flex flex-col items-center justify-center">
                          <button 
                            onClick={() => {
                              let newStatus = 'Checked';
                              let currentIntern = row._internStatus || 'Progress by SME';
                              let newIntern = currentIntern;
                              
                              let extraUpdates: any = {};

                              // SYNC LOGIC MAIN ➔ INTERN
                              if (row._normStatus === 'On Progress') {
                                  newStatus = 'Checked';
                                  newIntern = currentIntern.replace('Progress', 'Checked');
                                  if (!newIntern.includes('Checked')) newIntern = 'Checked by SME'; 
                                  
                                  // --- AUTO-CHECKLIST MATERIAL & TEST (TANPA STUDY CASE) ---
                                  extraUpdates = {
                                    'Material': 'Yes',
                                    'Test': 'Yes'
                                  };
                              }
                              else if (row._normStatus === 'Checked') {
                                  newStatus = 'Final';
                              }
                              else if (row._normStatus === 'Final') {
                                  newStatus = 'Archived';
                              }
                              else if (row._normStatus === 'Archived') {
                                  newStatus = 'On Progress';
                                  newIntern = currentIntern.replace('Checked', 'Progress');
                                  if (!newIntern.includes('Progress')) newIntern = 'Progress by SME';
                              }
                              
                              handleMultipleCellEdits(row._originalIndex, {
                                'Status': newStatus,
                                'Intern Status': newIntern,
                                ...extraUpdates 
                              });
                            }}
                            className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all w-full flex items-center justify-center gap-1.5 border shadow-sm ${
                               row._normStatus === 'Final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:shadow-md' :
                               row._normStatus === 'Checked' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:shadow-md' : 
                               row._normStatus === 'Archived' ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200 hover:shadow-md' :
                               'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:shadow-md'}`}
                            title="Click to toggle status (Progress -> Checked -> Final -> No Edit)"
                          >
                            {row._normStatus === 'Final' ? <><ShieldCheck size={12}/> FINAL</> : 
                             row._normStatus === 'Checked' ? <><CheckCircle2 size={12}/> {shortInternText.replace('PROG', 'CHK')}</> : 
                             row._normStatus === 'Archived' ? <><EyeOff size={12}/> NO EDIT</> :
                             <><History size={12}/> {shortInternText.replace('CHK', 'PROG')}</>}
                          </button>
                        </td>
                        <td className="px-4 py-2.5">
                          <EditableCell 
                            value={row['Group SBU/SFU']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Group SBU/SFU', val)}
                            className="font-bold text-slate-500 uppercase"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <EditableCell 
                            value={row._hrbp || ''} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'HRBP', val)}
                            className="text-[10px] font-black text-blue-600 uppercase text-center align-middle"
                          />
                        </td>
                        
                        <td className="px-4 py-2.5">
                          <EditableCell 
                            value={row['SME']} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'SME', val)}
                            className="font-bold text-slate-600 border border-slate-200/50 bg-white"
                          />
                        </td>

                        {['Material', 'Test', 'Study Case'].map((col) => (
                          <td key={col} className="px-3 py-2.5 text-center align-middle">
                            <button
                              onClick={() => handleCellEdit(row._originalIndex, col, row[col] === 'Yes' ? 'No' : 'Yes')}
                              className={`p-1.5 rounded-lg flex items-center justify-center mx-auto transition-colors border shadow-sm ${row[col] === 'Yes' ? 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'text-slate-300 bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                              title={`Tandai bahwa ${col} sudah ready`}
                            >
                              {row[col] === 'Yes' ? <CheckSquare size={14} /> : <Square size={14} />}
                            </button>
                          </td>
                        ))}

                        <td className="px-5 py-2.5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-bold text-slate-400 w-8">NEW:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell 
                                  value={row['Link Terbaru']} 
                                  onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link Terbaru', val)}
                                  className="text-blue-500"
                                  isLink={true}
                                />
                              </div>
                              {row._linkNew ? <a href={row._linkNew} target="_blank" rel="noreferrer" className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white shrink-0"><ExternalLink size={10} /></a> : <div className="p-1 bg-slate-50 text-slate-300 rounded border border-slate-100 cursor-not-allowed"><ExternalLink size={10} /></div>}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[8px] font-bold text-slate-400 w-8">OLD:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell 
                                  value={row['Link File Lama']} 
                                  onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link File Lama', val)}
                                  className="text-slate-500"
                                  isLink={true}
                                />
                              </div>
                              {row._linkOld ? <a href={row._linkOld} target="_blank" rel="noreferrer" className="p-1 bg-slate-50 text-slate-500 rounded hover:bg-slate-600 hover:text-white shrink-0"><History size={10} /></a> : <div className="p-1 bg-slate-50 text-slate-300 rounded border border-slate-100 cursor-not-allowed"><History size={10} /></div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-2.5 align-top">
                          <EditableCell 
                            value={row['Notes'] || ''} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Notes', val)}
                            isTextArea={true}
                            className="text-slate-600 text-[10px] font-medium whitespace-pre-wrap min-h-[40px] bg-white border border-slate-200 rounded-md !p-2 leading-relaxed"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-center align-top">
                          <button
                            type="button"
                            onClick={() => handleDeleteModule(row['Nama Module'])}
                            disabled={isSaving || !user}
                            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={`Delete ${row['Nama Module']}`}
                            aria-label={`Delete module ${row['Nama Module']}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        ) : activeTab === 'intern' ? (

          /* INTERN TRACKER TAB */
          <div className="h-full flex flex-col animate-in fade-in duration-300">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50/50 shrink-0 justify-between items-center pr-4">
                
                <div className="flex overflow-x-auto no-scrollbar p-1 items-center">
                  {[
                    { id: 'all', label: 'All Modules', count: metrics.total, color: 'slate' },
                    { id: 'active', label: 'Active Tasks', count: metrics.activeTotal, color: 'blue' },
                    { id: 'celine', label: "Celine's Tasks", count: metrics.celineProg + metrics.celineChk, color: 'pink' },
                    { id: 'diana', label: "Diana's Tasks", count: metrics.dianaProg + metrics.dianaChk, color: 'purple' }
                  ].map(v => (
                    <button key={v.id} onClick={() => setModuleView(v.id)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${moduleView === v.id ? `bg-white text-${v.color}-600 shadow-sm border border-slate-200` : 'text-slate-400 hover:text-slate-800'}`}>
                      {v.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full bg-${v.color}-50 text-${v.color}-600 text-[8px]`}>{v.count}</span>
                    </button>
                  ))}
                </div>

                {/* Dashboard Mini Intern */}
                <div className="hidden lg:flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest pl-4 py-2">
                   <div className="flex items-center gap-2 bg-pink-50/50 px-3 py-1.5 rounded-lg border border-pink-100">
                      <span className="text-pink-400">Celine:</span>
                      <span className="text-amber-500">{metrics.celineProg} Prog</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-indigo-500">{metrics.celineChk} Chk</span>
                   </div>
                   <div className="flex items-center gap-2 bg-purple-50/50 px-3 py-1.5 rounded-lg border border-purple-100">
                      <span className="text-purple-400">Diana:</span>
                      <span className="text-amber-500">{metrics.dianaProg} Prog</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-indigo-500">{metrics.dianaChk} Chk</span>
                   </div>
                </div>

              </div>

              <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
                <table className="w-full text-left border-collapse min-w-[1050px]">
                  <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm border-b border-slate-200">
                    <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <th className="px-4 py-3 w-10 text-center">NO</th>
                      <th className="px-4 py-3 min-w-[180px]">Nama Module</th>
                      <th className="px-4 py-3 text-center">Main Status</th>
                      <th className="px-4 py-3 text-center">Intern 6-State Flow</th>
                      <th className="px-4 py-3 text-center">Progress Bar</th>
                      <th className="px-4 py-3 min-w-[100px]">Target</th>
                      <th className="px-4 py-3 min-w-[200px] text-center">Embedded & Cloud Links</th>
                      <th className="px-4 py-3 min-w-[180px]">Intern Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tableData.map((row: any, idx: number) => {
                      const internStatus = row._internStatus;
                      const progressVal = Math.min(100, Math.max(0, parseInt(row['Intern Progress']) || 0));

                      let btnClass = 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                      if (internStatus.includes('Celine')) btnClass = 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100';
                      else if (internStatus.includes('Diana')) btnClass = 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
                      else if (internStatus.includes('SME')) btnClass = 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';

                      return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-2.5">
                          <span className="text-[10px] text-center font-bold text-slate-400 block">{row['No'] || row['NO']}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[10px] font-black text-slate-800 uppercase block leading-tight">{row['Nama Module']}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase mt-1 block">{row['Group SBU/SFU']}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border inline-flex items-center gap-1 ${
                               row._normStatus === 'Final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                               row._normStatus === 'Checked' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                               row._normStatus === 'Archived' ? 'bg-slate-100 text-slate-500 border-slate-300' :
                               'bg-amber-50 text-amber-700 border-amber-200'}`}
                          >
                             {row._normStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 flex justify-center">
                          <button 
                            onClick={() => {
                              const states = [
                                'Progress by SME',
                                'Progress by Celine', 
                                'Progress by Diana', 
                                'Checked by SME', 
                                'Checked by Celine', 
                                'Checked by Diana'
                              ];
                              
                              let currentIdx = states.indexOf(internStatus);
                              if (currentIdx === -1) currentIdx = -1; 
                              
                              const nextIntern = states[(currentIdx + 1) % states.length];
                              const nextMain = nextIntern.includes('Checked') ? 'Checked' : 'On Progress';
                              
                              let extraUpdates: any = {};
                              if (nextMain === 'Checked' && row._normStatus === 'On Progress') {
                                extraUpdates = {
                                  'Material': 'Yes',
                                  'Test': 'Yes'
                                };
                              }

                              handleMultipleCellEdits(row._originalIndex, {
                                 'Intern Status': nextIntern,
                                 'Status': nextMain,
                                 ...extraUpdates
                              });
                            }}
                            className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all w-[135px] flex items-center justify-center gap-1.5 border shadow-sm ${btnClass}`}
                            title="Cycles: Prog SME ➔ Prog Celine ➔ Prog Diana ➔ Chk SME ➔ Chk Celine ➔ Chk Diana"
                          >
                            {internStatus.includes('Checked') ? <UserCheck size={12}/> : <History size={12}/>}
                            {getShortInternStatus(internStatus)}
                          </button>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-col items-center gap-1.5 w-24 mx-auto">
                            <div className="flex items-center justify-center gap-1">
                               <EditableCell value={row['Intern Progress'] || '0'} onSave={(val: string) => handleCellEdit(row._originalIndex, 'Intern Progress', val)} className="text-center font-black text-slate-700 w-8 border-b border-dashed border-slate-300" />
                               <span className="text-[10px] font-black text-slate-400">%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progressVal}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                           <div className="bg-white border border-slate-200 rounded-lg flex items-center p-1 shadow-sm">
                             <Target size={12} className="text-rose-400 ml-1 mr-1.5 shrink-0" />
                             <EditableCell 
                                value={row['Intern Target'] || ''} 
                                onSave={(val: string) => handleCellEdit(row._originalIndex, 'Intern Target', val)}
                                className="text-[10px] text-slate-700 font-bold flex-1"
                             />
                           </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-col gap-1.5 text-[9px]">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-400 w-8">NEW:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell value={row['Link Terbaru']} onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link Terbaru', val)} className="text-blue-500" isLink={true} />
                              </div>
                              {row._linkNew ? <a href={row._linkNew} target="_blank" rel="noreferrer" className="p-1 bg-blue-50 text-blue-600 rounded shrink-0 hover:bg-blue-600 hover:text-white"><ExternalLink size={10} /></a> : <div className="p-1 text-slate-300 shrink-0"><ExternalLink size={10} /></div>}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-slate-400 w-8">OLD:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell value={row['Link File Lama']} onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link File Lama', val)} className="text-slate-500" isLink={true} />
                              </div>
                              {row._linkOld ? <a href={row._linkOld} target="_blank" rel="noreferrer" className="p-1 bg-slate-50 text-slate-500 rounded shrink-0 hover:bg-slate-600 hover:text-white"><History size={10} /></a> : <div className="p-1 text-slate-300 shrink-0"><History size={10} /></div>}
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-1.5 mt-0.5 border-t border-slate-100">
                              <span className="font-bold text-indigo-400 w-8 tracking-widest">EMB:</span>
                              <div className="flex-1 min-w-0">
                                <EditableCell value={row['Link Embedded']} onSave={(val: string) => handleCellEdit(row._originalIndex, 'Link Embedded', val)} className="text-indigo-500" isLink={true} />
                              </div>
                              {row['Link Embedded'] ? <a href={row['Link Embedded']} target="_blank" rel="noreferrer" className="p-1 bg-indigo-50 text-indigo-600 rounded shrink-0 hover:bg-indigo-600 hover:text-white"><Link2 size={10} /></a> : <div className="p-1 text-slate-300 shrink-0"><Link2 size={10} /></div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 align-top">
                          <EditableCell 
                            value={row['Intern Notes'] || ''} 
                            onSave={(val: string) => handleCellEdit(row._originalIndex, 'Intern Notes', val)}
                            isTextArea={true}
                            className="text-slate-700 text-[10px] font-medium whitespace-pre-wrap min-h-[50px] bg-amber-50/50 border border-amber-200/60 rounded-md !p-2 leading-relaxed"
                          />
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

        ) : (
          
          <div className="h-full max-w-4xl mx-auto w-full animate-in fade-in duration-300">
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {!isAuthorized ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center bg-slate-50/30 px-6">
                     <div className="bg-white p-5 rounded-2xl mb-4 border border-slate-200 shadow-sm"><Lock size={28} className="text-slate-400" /></div>
                     <h2 className="text-lg font-black text-slate-800 mb-1 tracking-tight">Access Management Locked</h2>
                     <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                     <div className="flex w-full max-w-xs gap-2">
                        <div className="relative flex-1">
                           <input type={showPassword ? 'text' : 'password'} value={passwordInput} onChange={(e: any) => setPasswordInput(e.target.value)} onKeyDown={(e: any) => { if(e.key === 'Enter') { if (passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); } }} placeholder="Enter Password..." className="w-full h-[38px] bg-white border border-slate-300 px-3 rounded-lg text-[11px] font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none pr-8 shadow-inner" />
                           <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        </div>
                        <button onClick={() => { if(passwordInput === 'MeratusAcademy') setIsAuthorized(true); else alert("Incorrect Password!"); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-[38px] rounded-lg text-[10px] font-black uppercase shadow-md transition-all active:scale-95">Unlock</button>
                     </div>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-2.5">
                         <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><FileSpreadsheet size={16} /></div>
                         <div><h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none">Global Data Source (TSV)</h2><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Raw Tab-Separated Values Engine</p></div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setIsAuthorized(false)} className="px-3 h-[32px] rounded-lg text-[9px] font-black uppercase border border-slate-200 hover:bg-slate-50 transition-colors">Lock</button>
                          <button onClick={handleSaveToCloud} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-[32px] rounded-lg text-[9px] font-black uppercase shadow-md transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95">{isSaving ? <RefreshCw className="animate-spin" size={11} /> : <Save size={11} />} {isSaving ? 'Syncing...' : 'Sync to Cloud'}</button>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-100/50 flex-1 flex min-h-0">
                      <textarea value={rawData} onChange={(e: any) => setRawData(e.target.value)} className="w-full h-full bg-white border border-slate-200 shadow-inner rounded-xl p-4 text-[10px] leading-relaxed font-mono text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none custom-scrollbar whitespace-pre" spellCheck="false" placeholder="Paste your TSV data here..."></textarea>
                    </div>
                  </>
                )}
             </div>
          </div>
        )}
      </main>

      {showAddModule && (
        <div className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-[2px] flex items-center justify-center p-4" onMouseDown={(e: any) => { if (e.target === e.currentTarget && !isSaving) closeAddModule(); }}>
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600"><Plus size={16}/></div>
                <div>
                  <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">Add New Module</h2>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Module data follows the existing tracker format</p>
                </div>
              </div>
              <button onClick={closeAddModule} disabled={isSaving} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"><X size={16}/></button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="md:col-span-2 flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nama Module <span className="text-rose-500">*</span></span>
                  <input autoFocus value={newModule.name} onChange={(e: any) => { setNewModule({...newModule, name: e.target.value}); setAddModuleError(''); }} placeholder="Masukkan nama module" className="h-[38px] px-3 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Group SBU/SFU</span>
                  <input list="add-module-sbu-list" value={newModule.sbu} onChange={(e: any) => setNewModule({...newModule, sbu: e.target.value})} placeholder="Pilih atau ketik SBU/SFU" className="h-[38px] px-3 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                  <datalist id="add-module-sbu-list">{suggestions.sbus.map((sbu: string) => <option key={sbu} value={sbu}/>)}</datalist>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">HRBP</span>
                  <input list="add-module-hrbp-list" value={newModule.hrbp} onChange={(e: any) => setNewModule({...newModule, hrbp: e.target.value})} placeholder={newModule.sbu ? `Auto: ${getHRBP(newModule.sbu)}` : 'Auto berdasarkan SBU/SFU'} className="h-[38px] px-3 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                  <datalist id="add-module-hrbp-list">{suggestions.hrbps.map((hrbp: string) => <option key={hrbp} value={hrbp}/>)}</datalist>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SME</span>
                  <input value={newModule.sme} onChange={(e: any) => setNewModule({...newModule, sme: e.target.value})} placeholder="Nama SME / PIC" className="h-[38px] px-3 rounded-lg border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                  <select value={newModule.status} onChange={(e: any) => setNewModule({...newModule, status: e.target.value})} className="h-[38px] px-3 rounded-lg border border-slate-300 bg-white text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="On Progress">On Progress</option><option value="Checked">Checked</option><option value="Final">Final</option><option value="Archived">No Edit / Archived</option>
                  </select>
                </label>

                <div className="md:col-span-2 grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {[['material', 'Material'], ['test', 'Test'], ['studyCase', 'Study Case']].map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg px-3 h-[38px] cursor-pointer">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider">{label}</span>
                      <input type="checkbox" checked={(newModule as any)[key] === 'Yes'} onChange={(e: any) => setNewModule({...newModule, [key]: e.target.checked ? 'Yes' : 'No'})} className="accent-emerald-600" />
                    </label>
                  ))}
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Link Terbaru</span>
                  <input type="url" value={newModule.linkNew} onChange={(e: any) => setNewModule({...newModule, linkNew: e.target.value})} placeholder="https://..." className="h-[38px] px-3 rounded-lg border border-slate-300 text-[11px] font-medium text-blue-600 outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Link File Lama</span>
                  <input type="url" value={newModule.linkOld} onChange={(e: any) => setNewModule({...newModule, linkOld: e.target.value})} placeholder="https://..." className="h-[38px] px-3 rounded-lg border border-slate-300 text-[11px] font-medium text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500" />
                </label>

                <label className="md:col-span-2 flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Notes</span>
                  <textarea value={newModule.notes} onChange={(e: any) => setNewModule({...newModule, notes: e.target.value})} rows={3} placeholder="Catatan tambahan (opsional)" className="p-3 rounded-lg border border-slate-300 text-[11px] font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </label>
              </div>
              {addModuleError && <p className="mt-3 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{addModuleError}</p>}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex justify-end gap-2 shrink-0">
              <button onClick={closeAddModule} disabled={isSaving} className="px-4 h-[34px] rounded-lg border border-slate-300 bg-white text-[9px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button onClick={handleAddModule} disabled={isSaving || !user} className="px-4 h-[34px] rounded-lg bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-md hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-60">
                {isSaving ? <RefreshCw size={11} className="animate-spin"/> : <Plus size={12}/>} {isSaving ? 'Saving...' : 'Add Module'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
           @page { size: A4 landscape; margin: 10mm; }
           body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; color: black !important; }
        }
      `}} />
    </div>
  );
}
