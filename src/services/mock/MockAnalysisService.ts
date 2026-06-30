import { IAnalysisService } from '../interfaces/IAnalysisService';
import { Analysis, CompanyInsight, RiskLevel, User } from '@/types';
import cachedData from './mock_jobs_cache.json';

// Fallback lists if cached data is missing
const fallbackCompanies: CompanyInsight[] = [
  {
    id: 'c1',
    name: 'Trendyol Group',
    logoUrl: 'TY',
    industry: 'E-Ticaret',
    employeeCountRange: '10,000+',
    averageGhostScore: 32,
    totalJobsAnalyzed: 142,
    ghostJobsCount: 15,
    activeJobsCount: 127,
    averageDaysOpen: 14,
    warningFlags: ['Aynı pozisyon için tekrarlayan ilanlar'],
  },
  {
    id: 'c2',
    name: 'Hepsiburada',
    logoUrl: 'HB',
    industry: 'E-Ticaret',
    employeeCountRange: '5,000 - 10,000',
    averageGhostScore: 48,
    totalJobsAnalyzed: 98,
    ghostJobsCount: 22,
    activeJobsCount: 76,
    averageDaysOpen: 28,
    warningFlags: ['30+ günden uzun süredir açık ilanlar', 'Yüksek çalışan turnover oranı'],
  },
  {
    id: 'c3',
    name: 'Getir',
    logoUrl: 'GT',
    industry: 'Hızlı Teslimat / Teknoloji',
    employeeCountRange: '10,000+',
    averageGhostScore: 78,
    totalJobsAnalyzed: 84,
    ghostJobsCount: 56,
    activeJobsCount: 28,
    averageDaysOpen: 65,
    warningFlags: ['İşe alım dondurma söylentileri', 'Ortalamanın çok üzerinde yayında kalma süresi', 'Düşük başvuru inceleme oranı'],
  },
  {
    id: 'c4',
    name: 'Midas',
    logoUrl: 'MD',
    industry: 'Finansal Teknolojiler',
    employeeCountRange: '100 - 500',
    averageGhostScore: 18,
    totalJobsAnalyzed: 45,
    ghostJobsCount: 3,
    activeJobsCount: 42,
    averageDaysOpen: 9,
    warningFlags: [],
  },
  {
    id: 'c5',
    name: 'Peak Games',
    logoUrl: 'PK',
    industry: 'Mobil Oyun',
    employeeCountRange: '200 - 500',
    averageGhostScore: 61,
    totalJobsAnalyzed: 37,
    ghostJobsCount: 16,
    activeJobsCount: 21,
    averageDaysOpen: 45,
    warningFlags: ['Belirsiz ve çok genel iş tanımı', 'İlanın son 90 günde 3 kez yenilenmesi'],
  }
];

const fallbackAnalyses: Analysis[] = [
  {
    id: 'a1',
    userId: 'mock-user-123',
    jobUrl: 'https://www.linkedin.com/jobs/view/3958102938',
    jobTitle: 'Senior React Developer',
    companyName: 'Getir',
    companyLogo: 'GT',
    location: 'İstanbul, Türkiye (Hibrit)',
    jobDescription: 'React, Next.js, Tailwind ve TypeScript bilen deneyimli Senior frontend geliştirici arıyoruz...',
    ghostScore: 82,
    riskLevel: 'high',
    analysisDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    criteriaBreakdown: {
      postingAge: { score: 95, text: 'İlan 72 gündür yayında ve güncellenmemiş.' },
      companyGrowth: { score: 85, text: 'Şirkette son 6 ayda mühendislik departmanında %12 küçülme var.' },
      descriptionAuthenticity: { score: 40, text: 'İş tanımı nispeten detaylı ancak bazı şablon ifadeler barındırıyor.' },
      recruiterActivity: { score: 98, text: 'İlana başvuran son 1200 adayın hiçbirine geri dönüş yapılmadı.' },
      salaryTransparency: { score: 90, text: 'Maaş aralığı veya yan haklar belirtilmemiş.' }
    },
    aiVerdict: 'Yüksek Hayalet İlan Riski!',
    aiExplanation: 'Bu ilanın gerçek bir işe alımdan ziyade, şirketin pazardaki varlığını sürdürmek, yetenek havuzu oluşturmak veya iç değişimleri maskelemek amacıyla yayında tutulma olasılığı son derece yüksektir (%82). Başvuru yaparken zaman kaybetme ihtimalinizi göz önünde bulundurun.',
    status: 'completed',
    isSaved: true
  },
  {
    id: 'a2',
    userId: 'mock-user-123',
    jobUrl: 'https://www.linkedin.com/jobs/view/3958291032',
    jobTitle: 'Frontend Engineer',
    companyName: 'Midas',
    companyLogo: 'MD',
    location: 'İstanbul, Türkiye (Uzaktan)',
    jobDescription: 'Finansal teknolojiler ekibimizde React ve React Native projelerinde yer alacak Frontend Engineer...',
    ghostScore: 15,
    riskLevel: 'low',
    analysisDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    criteriaBreakdown: {
      postingAge: { score: 10, text: 'İlan sadece 4 gün önce açılmış.' },
      companyGrowth: { score: 20, text: 'Şirket istikrarlı bir şekilde büyümeye devam ediyor (%8 net büyüme).' },
      descriptionAuthenticity: { score: 15, text: 'Oldukça spesifik, projeye özel teknik gereksinimler listelenmiş.' },
      recruiterActivity: { score: 12, text: 'İşe alım yöneticisi aktif olarak paylaşımlar yapıyor ve cv inceliyor.' },
      salaryTransparency: { score: 20, text: 'Maaş aralığı belirtilmemiş ancak yan haklar detaylandırılmış.' }
    },
    aiVerdict: 'Güvenli İlan (Gerçek Alım Sinyali)',
    aiExplanation: 'Bu ilan yeni yayınlanmış olup, şirketin aktif büyüme trendi ve işe alım ekibinin yüksek aktivitesiyle örtüşmektedir. Ghost Job olma ihtimali son derece düşüktür (%15). Güvenle başvuru yapabilirsiniz.',
    status: 'completed',
    isSaved: false
  },
  {
    id: 'a3',
    userId: 'mock-user-123',
    jobUrl: 'https://www.linkedin.com/jobs/view/3958204918',
    jobTitle: 'Product Manager',
    companyName: 'Hepsiburada',
    companyLogo: 'HB',
    location: 'İstanbul, Türkiye (Hibrit)',
    jobDescription: 'Müşteri deneyimi dikeyinde çalışacak, veri analitiği ve yol haritası yönetimi yapacak PM...',
    ghostScore: 45,
    riskLevel: 'medium',
    analysisDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    criteriaBreakdown: {
      postingAge: { score: 50, text: 'İlan 28 gündür yayında, haftalık olarak otomatik yenileniyor.' },
      companyGrowth: { score: 35, text: 'Şirket yatay seyrediyor, işe alımlar yavaşlamış durumda.' },
      descriptionAuthenticity: { score: 60, text: 'Çok genel ve kopyala-yapıştır ürün yönetimi şablonları kullanılmış.' },
      recruiterActivity: { score: 40, text: 'İlan sorumlusu son 2 haftadır LinkedIn üzerinde aktif değil.' },
      salaryTransparency: { score: 40, text: 'Ortalama bir sektör bütçesi ima edilmiş fakat net bilgi yok.' }
    },
    aiVerdict: 'Orta Düzey Risk (Havuz İlanı Olabilir)',
    aiExplanation: 'Bu ilan aktif bir pozisyon olabilir ancak şirketin genel işe alım hızı ve ilanın 4 haftadır açık olması, bunun gelecekteki ihtiyaçlar için açılmış bir yedek havuz (Pipeline) ilanı olma ihtimalini düşündürmektedir (%45).',
    status: 'completed',
    isSaved: true
  }
];

let mockCompanies: CompanyInsight[] = [];
let mockAnalyses: Analysis[] = [];

if (cachedData && cachedData.analyses && cachedData.analyses.length > 0) {
  mockAnalyses = cachedData.analyses.map((a: any) => ({
    ...a,
    userId: a.userId || 'mock-user-123',
    status: a.status || 'completed'
  })) as Analysis[];
  mockCompanies = cachedData.company_insights as CompanyInsight[];
} else {
  mockCompanies = fallbackCompanies;
  mockAnalyses = fallbackAnalyses;
}

if (typeof window !== 'undefined') {
  const savedAnalyses = localStorage.getItem('ayikla_analyses');
  if (savedAnalyses) {
    const existing = JSON.parse(savedAnalyses) as Analysis[];
    // Merge existing (user-added) and cached (scraped) jobs, ensuring no duplicate IDs
    const existingIds = new Set(existing.map((a) => a.id));
    const newCached = mockAnalyses.filter((a) => !existingIds.has(a.id));
    mockAnalyses = [...existing, ...newCached];
    localStorage.setItem('ayikla_analyses', JSON.stringify(mockAnalyses));
  } else {
    localStorage.setItem('ayikla_analyses', JSON.stringify(mockAnalyses));
  }

  const savedCompanies = localStorage.getItem('ayikla_companies');
  if (savedCompanies) {
    mockCompanies = JSON.parse(savedCompanies);
  } else {
    localStorage.setItem('ayikla_companies', JSON.stringify(mockCompanies));
  }
}

export class MockAnalysisService implements IAnalysisService {
  private extractJobDetails(url?: string, text?: string): { title: string; companyName: string; location: string } {
    let title = '';
    let companyName = '';
    let location = '';

    const commonTitles = [
      'Frontend Developer', 'Backend Engineer', 'Fullstack Developer', 'Data Scientist', 
      'Mobile Application Engineer', 'DevOps Specialist', 'Product Manager', 'QA Specialist',
      'UI/UX Designer', 'Data Engineer', 'HR Specialist', 'Technical Product Manager',
      'React Developer', 'Software Engineer', 'Yazılım Uzmanı', 'Yazılım Geliştirici',
      'QA Automation Engineer', 'Project Manager', 'Data Analyst'
    ];

    const commonLocations = [
      'İstanbul', 'Ankara', 'İzmir', 'Kocaeli', 'Bursa', 'Dublin', 'Londra', 
      'Amsterdam', 'Berlin', 'Uzaktan', 'Remote', 'Hibrit', 'Hybrid', 'Yerinde'
    ];

    // 1. Try to extract from URL query params or path slugs
    if (url) {
      try {
        const urlObj = new URL(url);
        
        // Parse from query parameters first
        const companyParam = urlObj.searchParams.get('company') || urlObj.searchParams.get('companyName') || urlObj.searchParams.get('org');
        const titleParam = urlObj.searchParams.get('title') || urlObj.searchParams.get('position');
        const locationParam = urlObj.searchParams.get('location') || urlObj.searchParams.get('loc');

        if (companyParam) companyName = companyParam;
        if (titleParam) title = titleParam;
        if (locationParam) location = locationParam;

        // Parse slug from URL pathname (e.g. /jobs/view/art-director-at-google-4430381695 or /jobs/view/art-director-4430381695)
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const slug = pathParts.find(part => part !== 'jobs' && part !== 'view' && isNaN(Number(part)));
        
        if (slug) {
          // Replace hyphens/underscores and decode percent-encodings
          let decodedSlug = decodeURIComponent(slug).replace(/[-_]/g, ' ');
          
          // Remove purely numeric parts (like ID numbers at the beginning or end)
          decodedSlug = decodedSlug.replace(/\b\d+\b/g, '').trim();

          const atMatch = decodedSlug.match(/(.+)\s+at\s+(.+)/i);
          if (atMatch) {
            if (!title) title = atMatch[1].trim();
            if (!companyName) companyName = atMatch[2].trim();
          } else {
            // Check if any known preseeded companies are in the slug
            const preseeded = ['trendyol', 'hepsiburada', 'getir', 'midas', 'peak games', 'google', 'amazon', 'insider', 'dream games', 'papara'];
            let foundCompany = '';
            for (const name of preseeded) {
              if (decodedSlug.toLowerCase().includes(name)) {
                foundCompany = name;
                break;
              }
            }
            if (foundCompany) {
              if (!companyName) companyName = foundCompany;
              if (!title) title = decodedSlug.replace(new RegExp(foundCompany, 'gi'), '').trim();
            } else {
              if (!title) title = decodedSlug;
            }
          }
        }
      } catch (e) {
        // Ignore URL parsing errors if it's not a full valid URL
      }

      // Parse company from domain or URL path (e.g. linkedin.com/jobs/view/... or some other job board)
      const lowerUrl = url.toLowerCase();
      if (!companyName) {
        if (lowerUrl.includes('trendyol')) companyName = 'Trendyol Group';
        else if (lowerUrl.includes('hepsiburada')) companyName = 'Hepsiburada';
        else if (lowerUrl.includes('getir')) companyName = 'Getir';
        else if (lowerUrl.includes('midas')) companyName = 'Midas';
        else if (lowerUrl.includes('google')) companyName = 'Google';
        else if (lowerUrl.includes('amazon')) companyName = 'Amazon';
        else if (lowerUrl.includes('insider')) companyName = 'Insider';
        else if (lowerUrl.includes('dreamgames') || lowerUrl.includes('dream-games')) companyName = 'Dream Games';
        else if (lowerUrl.includes('peakgames') || lowerUrl.includes('peak-games')) companyName = 'Peak Games';
        else if (lowerUrl.includes('papara')) companyName = 'Papara';
      }

      // Clean and capitalize
      if (title) {
        title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      if (companyName) {
        companyName = companyName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    // 2. Extract from Description
    const sourceText = text || '';
    const lowerText = sourceText.toLowerCase();
    const lines = sourceText.split('\n').map(l => l.trim()).filter(Boolean);

    // Try to find job title
    if (!title) {
      // Check if any common title is explicitly in the description
      for (const t of commonTitles) {
        if (lowerText.includes(t.toLowerCase())) {
          title = t;
          break;
        }
      }
      
      // Look for title patterns like "başlık:", "title:", "pozisyon:"
      const titleLabelPatterns = [
        /(?:pozisyon|position|job title|iş unvanı|başlık|rol|role)\s*:\s*([A-Za-z0-9ŞşĞğÇçİıÖöÜü\s\.\-\/\&]{2,50})/i,
      ];
      for (const pattern of titleLabelPatterns) {
        const match = sourceText.match(pattern);
        if (match && match[1]) {
          title = match[1].trim();
          break;
        }
      }

      // If not found, look at the first line
      if (!title && lines.length > 0) {
        const firstLine = lines[0];
        if (firstLine.length > 2 && firstLine.length < 60 && !firstLine.includes(':') && !firstLine.includes('.') && !firstLine.includes(',')) {
          title = firstLine;
        }
      }
    }

    // Try to find company name in text
    if (!companyName) {
      // Look for patterns like "şirket adı:", "company:", "at Google", "Trendyol bünyesinde", etc.
      const companyPatterns = [
        /(?:şirket\s*adı|company|firma|organizasyon|şirket)\s*:\s*([A-Za-z0-9ŞşĞğÇçİıÖöÜü\s\.\-]{3,30})/i,
        /([A-Za-z0-9ŞşĞğÇçİıÖöÜü\s\.\-]{3,30})\s*(?:bünyesinde|firmasında|şirketinde|ekibinde)/i,
        /(?:at|for|join)\s+([A-Za-z0-9ŞşĞğÇçİıÖöÜü\s\.\-]{3,30})\s+(?:as\s+|team)/i,
        /(?:hakkında|about)\s+([A-Za-z0-9ŞşĞğÇçİıÖöÜü\s\.\-]{3,30})/i
      ];

      for (const pattern of companyPatterns) {
        const match = sourceText.match(pattern);
        if (match && match[1]) {
          const cleaned = match[1].trim();
          // Ignore matches that are just common words or short
          if (cleaned && cleaned.length > 2 && !cleaned.toLowerCase().includes('pozisyon') && !cleaned.toLowerCase().includes('ilan')) {
            companyName = cleaned;
            break;
          }
        }
      }

      // Check if any of the preseeded companies is mentioned
      const preseededNames = [
        'Trendyol', 'Hepsiburada', 'Getir', 'Midas', 'Peak Games', 'Google', 
        'Amazon', 'Insider', 'Dream Games', 'Papara'
      ];
      for (const name of preseededNames) {
        if (lowerText.includes(name.toLowerCase())) {
          companyName = name;
          if (name === 'Trendyol') companyName = 'Trendyol Group';
          break;
        }
      }
    }

    // Try to find location
    if (!location) {
      // Check if any of the common locations are mentioned
      const foundLocations: string[] = [];
      for (const loc of commonLocations) {
        if (lowerText.includes(loc.toLowerCase())) {
          foundLocations.push(loc);
        }
      }
      if (foundLocations.length > 0) {
        // Prioritize Hybrid/Remote/Uzaktan if multiple found
        const primaryLoc = foundLocations.find(l => ['uzaktan', 'remote', 'hibrit', 'hybrid'].includes(l.toLowerCase()));
        location = primaryLoc || foundLocations[0];
      }
    }

    // Deterministic random pool fallback lists if not found
    const fallbackTitles = [
      'Graphic Designer', 'Art Director', 'UI/UX Designer', 'Product Designer',
      'Frontend Developer', 'Backend Engineer', 'Fullstack Developer', 'Data Scientist',
      'Mobile Application Engineer', 'DevOps Specialist', 'Product Manager', 'QA Specialist',
      'Data Engineer', 'HR Specialist', 'Technical Product Manager', 'React Developer',
      'Software Engineer', 'Yazılım Uzmanı', 'QA Automation Engineer', 'Project Manager',
      'Data Analyst', 'Marketing Specialist', 'Content Creator', 'SEO Expert'
    ];

    const fallbackCompanies = [
      'Trendyol Group', 'Hepsiburada', 'Getir', 'Midas', 'Peak Games', 'Google',
      'Amazon', 'Insider', 'Dream Games', 'Papara'
    ];

    const fallbackLocations = [
      'İstanbul, Türkiye (Hibrit)', 'İstanbul, Türkiye (Uzaktan)', 'Ankara, Türkiye (Uzaktan)',
      'İzmir, Türkiye (Uzaktan)', 'İstanbul, Türkiye (Yerinde)', 'Dublin, İrlanda (Hibrit)',
      'Londra, İngiltere (Uzaktan)', 'Amsterdam, Hollanda (Hibrit)'
    ];

    // Determine deterministic seed from Job ID or random
    let seed = 0;
    if (url) {
      const match = url.match(/linkedin\.com\/jobs\/view\/(\d+)/) || url.match(/jobs\/(\d+)/) || url.match(/(\d+)/);
      if (match && match[1]) {
        seed = Number(match[1]);
      }
    }
    if (!seed || isNaN(seed)) {
      seed = Math.floor(Math.random() * 100000);
    }

    if (!title) {
      title = fallbackTitles[seed % fallbackTitles.length];
    }

    if (!companyName || companyName === 'Bilinmeyen Şirket') {
      companyName = fallbackCompanies[(seed + 3) % fallbackCompanies.length];
    }

    if (!location || location === 'Türkiye') {
      location = fallbackLocations[(seed + 7) % fallbackLocations.length];
    }

    // Formatting refinements
    if (!location.toLowerCase().includes('uzaktan') && !location.toLowerCase().includes('remote') && !location.toLowerCase().includes('hibrit') && !location.toLowerCase().includes('hybrid')) {
      const types = ['(Hibrit)', '(Uzaktan)', '(Yerinde)'];
      const randType = types[Math.floor(Math.random() * types.length)];
      location = `${location} ${randType}`;
    }

    return { title, companyName, location };
  }

  async getAnalysisHistory(): Promise<Analysis[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let currentUserId = 'mock-user-123';
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('ayikla_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u && u.id) currentUserId = u.id;
      }
    }
    return [...mockAnalyses]
      .filter((a) => a.userId === currentUserId)
      .sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
  }

  async getAnalysisById(id: string): Promise<Analysis | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAnalyses.find((a) => a.id === id) || null;
  }

  async toggleSaveAnalysis(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockAnalyses.findIndex((a) => a.id === id);
    if (index !== -1) {
      mockAnalyses[index].isSaved = !mockAnalyses[index].isSaved;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayikla_analyses', JSON.stringify(mockAnalyses));
      }
      return mockAnalyses[index].isSaved;
    }
    return false;
  }

  async getCompanyInsights(): Promise<CompanyInsight[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockCompanies;
  }

  async getCompanyInsightByName(name: string): Promise<CompanyInsight | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockCompanies.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async analyzeJob(url?: string, description?: string): Promise<Analysis> {
    let scrapedTitle = '';
    let scrapedCompany = '';
    let scrapedLocation = '';

    if (url && typeof window !== 'undefined') {
      try {
        const res = await window.fetch(`/api/scrape-job?url=${encodeURIComponent(url)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.title) scrapedTitle = data.title;
          if (data.companyName) scrapedCompany = data.companyName;
          if (data.location) scrapedLocation = data.location;
        }
      } catch (err) {
        console.warn('Scraper API failed, falling back to mock extraction:', err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate Deep AI analysis

    // Parse job details dynamically using the extractor helper
    let { title, companyName, location } = this.extractJobDetails(url, description);

    // Override with actual scraped details if successfully resolved
    if (scrapedTitle) title = scrapedTitle;
    if (scrapedCompany) companyName = scrapedCompany;
    if (scrapedLocation) location = scrapedLocation;

    // Determine mock score based on text properties or purely random if none
    let score = Math.floor(Math.random() * 85) + 10; // 10 to 95
    if (description && (description.length < 150 || description.toLowerCase().includes('test description'))) {
      score = 85; // Low detail description increases risk
    }
    if (url && url.toLowerCase().includes('getir')) {
      score = 80;
    } else if (url && url.toLowerCase().includes('midas')) {
      score = 15;
    }

    const riskLevel: RiskLevel = score > 70 ? 'high' : score > 35 ? 'medium' : 'low';
    
    // Create breakdown details
    const postingAgeScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 20) - 10));
    const recruiterActivityScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 30) - 15));
    const growthScore = Math.min(100, Math.max(0, 100 - score + Math.floor(Math.random() * 20) - 10));
    const descScore = Math.min(100, Math.max(0, score + Math.floor(Math.random() * 20) - 10));
    const salScore = Math.random() > 0.5 ? 90 : 15;

    const breakdown: any = {
      postingAge: {
        score: postingAgeScore,
        text: postingAgeScore > 70 
          ? 'İlan 45 günden fazla süredir yayında ve hiç güncellenmemiş.' 
          : postingAgeScore > 35 
          ? 'İlan 18 gündür yayında, orta vadeli alım planına işaret ediyor.' 
          : 'İlan yeni yayınlanmış (Son 5 gün).'
      },
      companyGrowth: {
        score: growthScore,
        text: growthScore > 70
          ? 'Şirket son 3 ayda departman bazında küçülme veya duraklama yaşıyor.'
          : growthScore > 35
          ? 'Şirket büyümesi stabil, çalışan sayısı değişimi nötr seviyede.'
          : 'Şirket hızlı büyüyor, son çeyrekte %15 yeni işe alım gerçekleştirilmiş.'
      },
      descriptionAuthenticity: {
        score: descScore,
        text: descScore > 70
          ? 'İş tanımı son derece genel, kopyala-yapıştır şablonlarla oluşturulmuş.'
          : descScore > 35
          ? 'Standart bir iş tanımı, şirkete özel hedefler orta düzeyde yer alıyor.'
          : 'Oldukça spesifik, yapılacak işi ve projeyi detaylandıran özgün bir açıklama.'
      },
      recruiterActivity: {
        score: recruiterActivityScore,
        text: recruiterActivityScore > 70
          ? 'Son 100 başvuru için hiçbir CV incelemesi veya mülakat daveti yapılmamış.'
          : recruiterActivityScore > 35
          ? 'İlan sahibi ara sıra aktif ancak başvurular yavaş değerlendiriliyor.'
          : 'İlan veren İK uzmanı son 48 saat içinde aktif olarak adayları değerlendirdi.'
      },
      salaryTransparency: {
        score: salScore,
        text: salScore > 70
          ? 'Maaş, prim veya yan haklar konusunda hiçbir şeffaflık bulunmuyor.'
          : 'Maaş aralığı açıkça belirtilmiş veya yan haklar paket olarak sunulmuş.'
      }
    };

    let aiVerdict = '';
    let aiExplanation = '';

    if (riskLevel === 'high') {
      aiVerdict = 'Yüksek Ghost Job Riski!';
      aiExplanation = `Bu ilanın analiz kriterlerine göre, ${companyName} bünyesindeki "${title}" pozisyonunun gerçek bir işe alım amacıyla açılmama ihtimali %${score}'dir. İlanın uzun süredir açık olması veya şirketin son dönem insan kaynakları aktiviteleri bu riski desteklemektedir. Zamanınızı harcamadan önce temkinli olmanızı öneririz.`;
    } else if (riskLevel === 'medium') {
      aiVerdict = 'Orta Düzey Risk (Havuz İlanı)';
      aiExplanation = `"${title}" ilanın hayalet olma riski orta düzeydedir (%${score}). ${companyName} aktif bir alım planlıyor olabilir fakat süreç acil değildir, gelecekteki pozisyonlar için aday havuzu biriktiriliyor olabilir.`;
    } else {
      aiVerdict = 'Düşük Risk (Aktif İşe Alım)';
      aiExplanation = `${companyName} tarafından yayınlanan "${title}" ilanı gerçek bir işe alım sinyalidir (%${score} risk). İlanın yeni olması ve İK ekibinin aktif değerlendirme süreçleri bunu doğrulamaktadır. Başvurunuzu ertelemeden yapabilirsiniz!`;
    }

    // Dynamic addition of company insights if it does not exist yet
    const companyExists = mockCompanies.some(c => c.name.toLowerCase() === companyName.toLowerCase());
    if (!companyExists && companyName !== 'Bilinmeyen Şirket') {
      const companyId = `comp-${companyName.replace(/\s+/g, '-').toLowerCase()}`;
      const newCompany: CompanyInsight = {
        id: companyId,
        name: companyName,
        logoUrl: companyName.substring(0, 2).toUpperCase(),
        industry: 'Teknoloji / Yazılım',
        employeeCountRange: '100 - 500',
        averageGhostScore: score,
        totalJobsAnalyzed: 1,
        ghostJobsCount: riskLevel === 'high' ? 1 : 0,
        activeJobsCount: riskLevel === 'low' ? 1 : 0,
        averageDaysOpen: Math.floor(Math.random() * 20) + 5,
        warningFlags: riskLevel === 'high' ? ['Yüksek riskli ilan tespiti'] : []
      };
      mockCompanies.push(newCompany);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ayikla_companies', JSON.stringify(mockCompanies));
      }
    } else if (companyExists && companyName !== 'Bilinmeyen Şirket') {
      const index = mockCompanies.findIndex(c => c.name.toLowerCase() === companyName.toLowerCase());
      if (index !== -1) {
        const c = mockCompanies[index];
        c.totalJobsAnalyzed += 1;
        if (riskLevel === 'high') {
          c.ghostJobsCount += 1;
          if (!c.warningFlags.includes('Yüksek riskli ilan tespiti')) {
            c.warningFlags.push('Yüksek riskli ilan tespiti');
          }
        } else {
          c.activeJobsCount += 1;
        }
        c.averageGhostScore = Math.round((c.averageGhostScore * (c.totalJobsAnalyzed - 1) + score) / c.totalJobsAnalyzed);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ayikla_companies', JSON.stringify(mockCompanies));
        }
      }
    }

    let currentUserId = 'mock-user-123';
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('ayikla_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u && u.id) currentUserId = u.id;
      }
    }

    const newAnalysis: Analysis = {
      id: 'a' + (mockAnalyses.length + 1),
      userId: currentUserId,
      jobUrl: url,
      jobTitle: title,
      companyName: companyName,
      companyLogo: companyName.substring(0, 2).toUpperCase(),
      location: location,
      jobDescription: description,
      ghostScore: score,
      riskLevel: riskLevel,
      analysisDate: new Date().toISOString(),
      criteriaBreakdown: breakdown,
      aiVerdict: aiVerdict,
      aiExplanation: aiExplanation,
      status: 'completed',
      isSaved: false
    };

    mockAnalyses.push(newAnalysis);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ayikla_analyses', JSON.stringify(mockAnalyses));
      
      // Update the user's limit/usage count
      const savedUser = localStorage.getItem('ayikla_user');
      if (savedUser) {
        const user: User = JSON.parse(savedUser);
        user.analysisUsed += 1;
        localStorage.setItem('ayikla_user', JSON.stringify(user));
      }
    }

    return newAnalysis;
  }
}
