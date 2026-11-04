/** Optional Bengali summaries. Detailed archives/case studies remain explicitly English. */
export const bengaliPages = {
  "": {
    title: "হ্যালো, আমি আফনান।",
    text: "আমি একজন শিক্ষার্থী। প্রযুক্তি, কৃত্রিম বুদ্ধিমত্তা, গবেষণা ও ওয়েব ডেভেলপমেন্টে আমার আগ্রহ। Nyayota আমার চলমান মূল প্রকল্প। কাজটি করতে আমি AI-এর সহায়তা নিই এবং ওয়েব ডেভেলপমেন্ট শিখছি।",
    english: "/",
    label: "Home",
  },
  about: {
    title: "আমার সম্পর্কে",
    text: "কোনো তথ্য কীভাবে সাজালে তা পড়া ও বোঝা সহজ হয়, সেটি নিয়ে আমার আগ্রহ। প্রকল্পের মাধ্যমে শিখছি। নিজের লেখা কোড হিসেবে সব AI-সহায়তায় তৈরি কাজকে দাবি করি না।",
    english: "/about/",
    label: "About",
  },
  projects: {
    title: "আমার প্রকল্প",
    text: "Nyayota বাংলাদেশের আইনসংক্রান্ত তথ্য পড়া ও খোঁজার একটি চলমান প্রকল্প। প্রকল্পের উদ্দেশ্য, আমার ভূমিকা এবং সীমাবদ্ধতা ইংরেজি কেস স্টাডিতে বিস্তারিত আছে।",
    english: "/projects/",
    label: "Projects",
  },
  blog: {
    title: "কাজের ছোট নোট",
    text: "ওয়েবে কাজ করতে গিয়ে যা শিখছি, তা নিয়ে এখানে ছোট নোট রাখতে চাই। কোনো প্রকাশিত পোস্ট এখনো যোগ করা হয়নি।",
    english: "/blog/",
    label: "Blog",
  },
  writing: {
    title: "লেখালেখি",
    text: "দীর্ঘ লেখা রাখার জন্য এই জায়গা। এখনো কোনো প্রকাশিত লেখা বা বই যোগ করা হয়নি।",
    english: "/writing/",
    label: "Writing",
  },
  vault: {
    title: "উৎস ও শেখার নোট",
    text: "প্রকল্পের প্রকাশ্য সোর্স কোড ও শেখার নোট এখানে রাখা আছে। সোর্স কোডের লিংক কোনো যোগ্যতা বা স্বাধীন যাচাইয়ের প্রমাণ নয়।",
    english: "/vault/",
    label: "Vault",
  },
  cv: {
    title: "সংক্ষিপ্ত পরিচিতি",
    text: "আমি প্রযুক্তি ও ওয়েব ডেভেলপমেন্টে আগ্রহী একজন শিক্ষার্থী। প্রকল্পভিত্তিক পরিচিতি ইংরেজিতে পড়তে বা PDF হিসেবে সংরক্ষণ করতে পারেন।",
    english: "/cv/",
    label: "CV",
  },
  contact: {
    title: "কথা বলুন",
    text: "প্রকল্প নিয়ে প্রশ্ন থাকলে বা কথা বলতে চাইলে আমাকে ইমেইল করতে পারেন। সব যোগাযোগের মাধ্যম ইংরেজি পাতায় দেওয়া আছে।",
    english: "/contact/",
    label: "Contact",
  },
} as const;
interface OverviewPage {
  title: string;
  text: string;
  english: string;
  label: string;
}
interface OverviewLanguage {
  language: string;
  ogLocale: string;
  label: string;
  eyebrow: string;
  notice: string;
  navigationLabel: string;
  englishLabel: string;
  pages: Record<string, OverviewPage>;
}
/** Add another dictionary here: the shared static routes and switch pick it up. */
export const overviewLanguages: Record<string, OverviewLanguage> = {
  bn: {
    language: "bn",
    ogLocale: "bn_BD",
    label: "বাংলা পরিচিতি",
    eyebrow: "বাংলা পরিচিতি · সংক্ষিপ্ত সংস্করণ",
    notice:
      "এটি সংক্ষিপ্ত বাংলা পরিচিতি। বিস্তারিত পাতা ও প্রকল্পের নথি ইংরেজিতে রয়েছে।",
    navigationLabel: "বাংলা পাতাগুলো",
    englishLabel: "Read the full page in English",
    pages: bengaliPages,
  },
};
