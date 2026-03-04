import { createElement } from "react";
import type { ReactNode } from "react";
import {
  GiDna1,
  GiRadarSweep,
  GiMedal,
  GiMusicalNotes,
  GiSleepingBag,
  GiFireBowl,
  GiBodySwapping,
} from "react-icons/gi";
import {
  MdOutlineBarChart,
  MdOutlineTrendingUp,
  MdOutlineCalendarMonth,
  MdOutlineAutoGraph,
  MdOutlineDonutSmall,
  MdOutlineTrendingDown,
  MdOutlineMap,
  MdOutlineEditNote,
  MdOutlineLocalLibrary,
  MdOutlineCrisisAlert,
  MdOutlineSchool,
  MdOutlineSelfImprovement,
  MdOutlineNotificationsActive,
  MdOutlineLanguage,
  MdOutlineLightbulb,
  MdOutlineMicNone,
  MdOutlineGroups,
  MdOutlineCampaign,
  MdOutlineChat,
} from "react-icons/md";
import {
  RiBrainLine,
  RiRobot2Line,
  RiMentalHealthLine,
  RiHeartPulseLine,
  RiMoonLine,
  RiPlantLine,
  RiSparkling2Line,
  RiBubbleChartLine,
  RiShieldStarLine,
  RiScales3Line,
  RiBookOpenLine,
  RiPuzzleLine,
  RiTimeLine,
} from "react-icons/ri";
import {
  FiTarget,
  FiAward,
  FiZap,
  FiFileText,
  FiRefreshCw,
  FiBookOpen,
  FiUsers,
  FiUserCheck,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";
import { LuHeartHandshake, LuMicroscope } from "react-icons/lu";
import { TbListDetails, TbBulb } from "react-icons/tb";
import { PiCertificateBold, PiTreeEvergreenBold } from "react-icons/pi";
import { BsPersonHeart } from "react-icons/bs";

// Helper to create icon elements with default styling
const ic = (Component: React.ElementType, size = 22) =>
  createElement(Component, { size, style: { display: "inline-block" } });

export const ALL_FEATURES: Record<string, { icon: ReactNode; title: string; desc: string }[]> = {
  "Core UHUM": [
    { icon: ic(GiDna1), title: "UHUM Assessment", desc: "5-step structured evaluation mapping your emotional triggers, strengths, stress response, cognitive patterns, and mood stability into a unique fingerprint." },
    { icon: ic(GiRadarSweep), title: "Radar Profile Visualization", desc: "7-axis spider chart showing all emotional dimensions at a glance � your personal emotional map, beautifully rendered." },
    { icon: ic(BsPersonHeart), title: "Dominant Emotion Type Badge", desc: "Assigned a personality-style type like 'The Reflective Processor' or 'The Adaptive Warrior' based on your unique profile." },
    { icon: ic(MdOutlineBarChart), title: "UHUM Score (0�100)", desc: "Overall emotional awareness and health score that tracks your growth over time as you complete exercises and check-ins." },
    { icon: ic(FiRefreshCw, 20), title: "UHUM Re-Assessment", desc: "Retake assessments monthly to see how your profile shifts and evolves � track your emotional growth over time." },
    { icon: ic(PiCertificateBold), title: "UHUM Certificate", desc: "Downloadable, beautifully designed certificate showcasing your emotional profile, top strengths, and growth milestones." },
  ],
  "Dashboard & Analytics": [
    { icon: ic(MdOutlineTrendingUp), title: "Emotional Trends Chart", desc: "7-day and 30-day line charts tracking mood, stress, and resilience simultaneously with hover tooltips." },
    { icon: ic(MdOutlineCalendarMonth), title: "Emotion Heatmap Calendar", desc: "30-day color-coded calendar showing your best and worst emotional days at a glance." },
    { icon: ic(FiTarget), title: "Trigger Frequency Analysis", desc: "Bar charts showing which emotional triggers fire most often and when, so you can anticipate and prepare." },
    { icon: ic(RiBubbleChartLine), title: "Predictive Emotion Engine", desc: "Based on your patterns, predicts emotionally challenging days 24�48 hours ahead with a proactive action plan." },
    { icon: ic(MdOutlineDonutSmall), title: "Response Style Donut", desc: "Visual breakdown of your Fight/Flight/Freeze/Flow response patterns across the week." },
    { icon: ic(MdOutlineTrendingDown), title: "Weekly UHUM Shift", desc: "Before/after comparison showing which of the 7 emotional dimensions improved or declined each week." },
  ],
  "Growth & Therapy Tools": [
    { icon: ic(MdOutlineMap), title: "Personalized Growth Roadmap", desc: "4-week visual timeline with daily emotional tasks, exercises, and milestones matched to your UHUM profile." },
    { icon: ic(MdOutlineEditNote), title: "CBT Thought Record", desc: "Interactive digital CBT worksheet � log situation, thought, emotion, and receive a personalized cognitive reframe." },
    { icon: ic(PiTreeEvergreenBold), title: "Somatic Exercise Library", desc: "Body-based grounding exercises matched to your stress response style: tapping, progressive relaxation, grounding sequences." },
    { icon: ic(RiHeartPulseLine), title: "Animated Breathwork Guide", desc: "Visual breathing circle guiding Box Breathing, 4-7-8, Coherence Breathing, and Wim Hof techniques with timers." },
    { icon: ic(FiBookOpen), title: "Smart Emotion Journal", desc: "Free-form journaling with NLP analysis that auto-detects emotional themes, cognitive distortions, and growth moments." },
    { icon: ic(FiMessageSquare), title: "Dream Journal", desc: "Log and track dream patterns alongside your emotional data to identify deeper subconscious patterns." },
  ],
  "AI & Coaching": [
    { icon: ic(RiRobot2Line), title: "AI Emotional Coach 'Emo'", desc: "24/7 personalized AI coach that knows your UHUM profile and delivers CBT prompts, exercises, and emotional support." },
    { icon: ic(MdOutlineMicNone), title: "Voice Emotion Detection", desc: "Record a 30-second voice note; AI analyzes tone and speech patterns to detect stress, sadness, or calm." },
    { icon: ic(MdOutlineNotificationsActive), title: "Micro-Intervention Notifications", desc: "When your mood dips, receive a 2-minute personalized intervention � not a generic tip, but one matched to your profile." },
    { icon: ic(RiBrainLine), title: "Cognitive Pattern Alerts", desc: "Real-time detection of cognitive distortion language in journals and chat, with instant reframe suggestions." },
    { icon: ic(MdOutlineLanguage), title: "Multilingual Support", desc: "Available in English, Hindi, Tamil, and 7 other languages � making emotional wellness accessible across India." },
    { icon: ic(TbBulb), title: "Daily Insight Cards", desc: "Morning emotional insight based on your last check-in, pattern analysis, and today's emotional forecast." },
  ],
  "Mindfulness & Sleep": [
    { icon: ic(RiMentalHealthLine), title: "Adaptive Meditation Sessions", desc: "Meditations that adapt based on your emotional state each day � not a fixed library but a responsive system." },
    { icon: ic(GiSleepingBag, 20), title: "Sleep Soundscapes", desc: "Forest rain, ocean waves, white noise, and fireplace sounds with a sleep quality tracker and bedtime ritual checklist." },
    { icon: ic(RiMoonLine), title: "Bedtime Wind-Down Routine", desc: "Guided 15-minute bedtime sequence personalized to your stress profile to improve sleep onset and quality." },
    { icon: ic(GiMusicalNotes), title: "Micro-Meditation Sessions", desc: "2�10 minute sessions for stress, anxiety, focus, and emotional reset � designed for busy schedules." },
    { icon: ic(MdOutlineAutoGraph), title: "Mood-Matched Playlists", desc: "Curated ambient audio playlists matched to your current emotional state and UHUM stress response style." },
    { icon: ic(RiTimeLine), title: "Wearable Integration", desc: "Connect Apple Watch, Fitbit, or Oura Ring to incorporate HRV and sleep data into your UHUM analytics." },
  ],
  "Community & Sharing": [
    { icon: ic(LuHeartHandshake), title: "Trusted Circle Sharing", desc: "Selectively share progress snapshots, emotional trends, and trigger insights with 2�5 trusted people only." },
    { icon: ic(FiUserCheck), title: "Therapist Portal", desc: "Invite your therapist to view your UHUM dashboard � giving professionals meaningful data for better sessions." },
    { icon: ic(FiUsers), title: "Accountability Partner", desc: "Pair with a friend who has a complementary emotional profile; share weekly snapshots and cheer each other on." },
    { icon: ic(BsPersonHeart), title: "Family Emotional Literacy", desc: "Parents track their child's (ages 8�16) emotional patterns with age-appropriate assessments and insights." },
    { icon: ic(MdOutlineGroups), title: "Peer Mentor Matching", desc: "Get matched anonymously with users further ahead in their UHUM journey as informal growth mentors." },
    { icon: ic(MdOutlineCampaign), title: "Monthly Group Challenges", desc: "Safe, themed monthly emotional challenges � like 'Trigger Awareness Week' � with community progress tracking." },
  ],
  "Badges & Progress": [
    { icon: ic(RiBrainLine), title: "Cognitive Flexibility Badge", desc: "Earned by successfully reframing 10 negative thought patterns using CBT tools in the app." },
    { icon: ic(RiShieldStarLine), title: "Stress Recovery Pro Badge", desc: "Awarded after demonstrating fast recovery from 5 high-stress events tracked in your dashboard." },
    { icon: ic(RiScales3Line), title: "Emotional Balance Badge", desc: "Earned by maintaining mood stability scores above 70 for 7 consecutive days." },
    { icon: ic(FiTarget), title: "Thought Accuracy Badge", desc: "Complete 5 CBT thought records with scored accuracy; track how your thinking patterns improve." },
    { icon: ic(GiFireBowl, 20), title: "Resilience Streak Badge", desc: "30-day consistent daily check-in and growth task completion � your longest emotional growth streak." },
    { icon: ic(RiSparkling2Line), title: "UHUM Elite Badge", desc: "Reach an overall UHUM score of 90+ � the ultimate recognition of your emotional growth journey." },
  ],
  "Education & Therapy": [
    { icon: ic(RiBookOpenLine), title: "Psychoeducation Library", desc: "50+ short modules on emotions, CBT, ACT, resilience, relationships, and stress � all matched to your UHUM." },
    { icon: ic(MdOutlineSchool), title: "Video Lesson Series", desc: "5-minute video lessons from licensed therapists and psychologists on key emotional wellness topics." },
    { icon: ic(MdOutlineSelfImprovement), title: "Therapist Marketplace", desc: "Browse and book sessions with licensed therapists matched to your UHUM profile and issues." },
    { icon: ic(MdOutlineChat), title: "Therapy Session Prep Tool", desc: "Before each therapy session, generate an UHUM summary report to share with your therapist." },
    { icon: ic(RiPuzzleLine), title: "CBT & ACT Journeys", desc: "Structured 4-week self-help programs using evidence-based CBT and ACT techniques � guided step by step." },
    { icon: ic(MdOutlineCrisisAlert), title: "Crisis Support Detection", desc: "Sensitive language monitoring with immediate display of helpline resources and safety guidance when needed." },
  ],
};

export const TESTIMONIALS = [
  { emoji: "??", name: "Priya R.", role: "Software Engineer, Bangalore", text: "UHUM actually helped me understand why I freeze in conflicts. The CBT tools matched to my profile made such a difference in just 3 weeks.", stars: 5 },
  { emoji: "??", name: "Arjun M.", role: "College Student, Chennai", text: "The predictive alerts are wild � it told me Tuesday would be hard and it was right. Having that heads-up helped me prepare my coping plan.", stars: 5 },
  { emoji: "??", name: "Sneha K.", role: "Teacher, Mumbai", text: "I shared my UHUM report with my therapist and she said it was the most useful thing a client had ever brought her. Game changer.", stars: 5 },
  { emoji: "??", name: "Rahul T.", role: "Entrepreneur, Delhi", text: "The Trusted Circle feature means my wife can see my emotional trends without me having to explain everything. It's brought us closer.", stars: 5 },
  { emoji: "??", name: "Meera D.", role: "HR Manager, Hyderabad", text: "I've tried Headspace and Calm. UHUM is the first app that feels like it actually knows me. The UHUM score going from 61 to 79 in 6 weeks was amazing.", stars: 5 },
  { emoji: "??", name: "Vikram S.", role: "Doctor, Pune", text: "The psychoeducation library is excellent � proper CBT content, not vague affirmations. And the crisis detection feature is well implemented.", stars: 5 },
];

export const DIMENSIONS = [
  { name: "Resilience", score: 82, color: "#4AAFDA" },
  { name: "Triggers", score: 65, color: "#F4A57A" },
  { name: "Strengths", score: 88, color: "#6ECBA8" },
  { name: "Mood Stability", score: 74, color: "#B8A4E0" },
  { name: "Reactivity", score: 58, color: "#F4A57A" },
  { name: "Stress Style", score: 70, color: "#4AAFDA" },
  { name: "Cog. Patterns", score: 62, color: "#6ECBA8" },
];

export const HEATMAP_COLORS = [
  '#E8F4FD', '#C5E3F7', '#7EC8E3', '#4AAFDA', '#E8F4FD', '#FFD5BC', '#E8F8F2',
  '#C5E3F7', '#4AAFDA', '#7EC8E3', '#E8F4FD', '#FFD5BC', '#7EC8E3', '#C5E3F7',
  '#FFF0E8', '#4AAFDA', '#7EC8E3', '#C5E3F7', '#FFD5BC', '#4AAFDA', '#E8F8F2',
  '#7EC8E3', '#FFF0E8', '#C5E3F7', '#4AAFDA', '#E8F4FD', '#FFD5BC', '#7EC8E3',
  '#C5E3F7', '#4AAFDA',
];

export const FEATURE_CARDS = [
  {
    icon: ic(RiBrainLine, 26),
    color: 'sky' as const,
    title: 'Insights Dashboard',
    desc: 'UHUM transforms your daily reflections into clear, calming visual insights that help you notice emotional trends and shifts over time � without overwhelming analytics.',
    items: ['Seven-day emotional trends', 'Emotion heatmaps', 'Response-style insights', 'Gentle predictive alerts'],
  },
  {
    icon: ic(RiPlantLine, 26),
    color: 'mint' as const,
    title: 'Growth Roadmap',
    desc: 'Based on your emotional patterns and personal goals, UHUM creates personalised four-week growth paths designed around evidence-based psychological practices.',
    items: ['Reflective exercises', 'CBT thought records', 'Somatic grounding practices', 'Progress checkpoints'],
  },
  {
    icon: ic(RiRobot2Line, 26),
    color: 'lavender' as const,
    title: 'AI Emotional Coach � Emo',
    desc: 'Emo is your AI emotional coach � thoughtful and personalised, offering support that feels relevant and grounded rather than generic. Available at any time, without judgment.',
    items: ['Supportive conversations', 'CBT-inspired prompts', 'Emotional regulation exercises', 'Early crisis-support detection'],
  },
  {
    icon: ic(RiMoonLine, 26),
    color: 'peach' as const,
    title: 'Mindfulness & Sleep Hub',
    desc: 'A dedicated space for relaxation, emotional regulation, and sleep preparation. Practices adapt gently to your emotional state, helping you slow down and reset.',
    items: ['Adaptive guided meditations', 'Box Breathing & 4-7-8', 'Calming sleep soundscapes', 'Bedtime wind-down rituals'],
  },
  {
    icon: ic(LuHeartHandshake, 26),
    color: 'sky' as const,
    title: 'Trusted Circle',
    desc: 'Share selected progress updates with a small circle of trusted individuals � friends, family, or a therapist. You remain fully in control of what is shared and when.',
    items: ['Progress snapshots', 'Therapist collaboration', 'Accountability planning', 'Detailed privacy controls'],
  },
  {
    icon: ic(GiMedal, 26),
    color: 'mint' as const,
    title: 'Growth Milestones',
    desc: 'UHUM celebrates psychological development through milestones that reflect genuine emotional growth rather than productivity metrics � gentle reminders of progress that often goes unnoticed.',
    items: ['Improved cognitive flexibility', 'Stronger stress recovery', 'Emotional balance over time', 'Sustained self-awareness'],
  },
  {
    icon: ic(RiBookOpenLine, 26),
    color: 'lavender' as const,
    title: 'Psychoeducation Library',
    desc: 'A structured learning library based on CBT and ACT frameworks, designed to make emotional understanding accessible and applicable to everyday life.',
    items: ['Guided learning modules', 'Video lessons', 'Structured development programs', 'Therapist pathways'],
  },
  {
    icon: ic(GiDna1, 26),
    color: 'peach' as const,
    title: 'UHUM Profiling',
    desc: 'A guided five-step assessment that understands how you experience stress, emotions, and recovery � creating a personalised emotional profile that shapes your entire journey.',
    items: ['Emotional triggers', 'Stress response styles', 'Cognitive thinking patterns', 'Resilience tendencies'],
  },
];

export const STEPS = [
  { n: 1, icon: ic(GiDna1, 28), title: 'Take the UHUM Assessment', desc: 'Answer 25 carefully designed questions across 5 categories. Takes 8�10 minutes. No clinical jargon.' },
  { n: 2, icon: ic(LuMicroscope, 28), title: 'Get Your Emotional Profile', desc: 'Receive your 7-dimension UHUM fingerprint, dominant type, score, and cognitive pattern analysis instantly.' },
  { n: 3, icon: ic(MdOutlineMap, 28), title: 'Follow Your Growth Plan', desc: 'Your personalized roadmap with daily tasks, exercises, and skill-building matched exactly to your UHUM.' },
  { n: 4, icon: ic(FiTrendingUp, 28), title: 'Track & Evolve', desc: 'Watch your UHUM shift and grow. Daily check-ins, weekly reports, and monthly profile re-assessments.' },
];

export const PRICING_PLANS = [
  {
    plan: "Free Explorer",
    price: "0",
    per: "forever free",
    featured: false,
    badge: null,
    features: ["Basic UHUM Assessment", "3-Dimension Profile", "Daily Mood Check-in", "2 Guided Meditations", "Community Access"],
  },
  {
    plan: "Growth Pro",
    price: "xx",
    per: "/month",
    featured: true,
    badge: "Most Popular",
    features: ["Full 7-Dimension UHUM", "AI Coach 'Emo' Access", "Complete Dashboard Analytics", "Personalized Growth Roadmap", "CBT & Breathwork Tools", "Trusted Circle (3 people)", "All Badges & Certificates"],
  },
  {
    plan: "Therapy Plus",
    price: "xx",
    per: "/month",
    featured: false,
    badge: "Best Value",
    features: ["Everything in Growth Pro", "Therapist Portal Access", "Voice Emotion Detection", "Predictive Emotion Engine", "Wearable Integration", "Trusted Circle (5 people)", "Priority Support"],
  },
];
