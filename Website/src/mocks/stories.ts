export interface StorySection {
  type: 'paragraph' | 'quote' | 'image' | 'stat' | 'heading';
  content?: string;
  caption?: string;
  src?: string;
  stat?: string;
  label?: string;
}

export interface Story {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  sections: StorySection[];
  relatedSlugs: string[];
}

export const stories: Story[] = [
  {
    slug: 'community-events',
    title: 'Community Events',
    subtitle: 'How a single block party in Austin sparked a movement that now reaches 340 cities worldwide',
    heroImage: 'https://images.pexels.com/photos/2974236/pexels-photo-2974236.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Live Events',
    date: 'March 2025',
    author: 'Maria Torres',
    authorRole: 'Chapter Lead, Austin TX',
    readTime: '6 min read',
    sections: [
      { type: 'paragraph', content: "It started with a folding table, a borrowed PA system, and a handwritten sign that read 'Free Tacos & Talk.' In the summer of 2019, Maria Torres set up on the corner of 12th and Chicon in East Austin, not knowing if anyone would show up. By sunset, over 200 neighbors had gathered — sharing food, stories, and for the first time in years, genuine connection." },
      { type: 'quote', content: "We did not plan a movement. We planned a Tuesday. The movement just showed up." },
      { type: 'paragraph', content: "That Tuesday became a monthly ritual. Then a weekly one. Then other neighborhoods started asking how to do it themselves. Within 18 months, the 'CommonGround Gathering' model had spread to 47 cities across Texas, Oklahoma, and Louisiana. Today, the network hosts over 2,400 events annually — from intimate porch conversations to city-wide festivals drawing 50,000 attendees." },
      { type: 'stat', stat: '2,400+', label: 'Annual events across 340 cities' },
      { type: 'paragraph', content: "What makes these events different is not the scale — it is the intention. Every gathering follows three simple rules: no agenda, no speakers, no selling. Just show up, bring something to share, and talk to someone you do not know. The magic happens in the unstructured space between planned moments." },
      { type: 'image', src: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'A CommonGround Gathering in Portland, Oregon — Spring 2024' },
      { type: 'heading', content: 'The Science of Belonging' },
      { type: 'paragraph', content: "Dr. Amara Okafor, a social psychologist who has studied CommonGround events since 2021, published findings in the Journal of Community Psychology showing that attendees report a 34% increase in neighborhood trust after just three gatherings. 'These events create what we call weak tie density,' she explains. 'You do not need to become best friends with your neighbors. You just need to know their names and feel comfortable asking for a cup of sugar. That threshold changes everything.'" },
      { type: 'paragraph', content: "The model has proven especially powerful in post-disaster recovery. After Hurricane Ida devastated parts of Louisiana in 2021, CommonGround chapters in Baton Rouge and New Orleans organized daily community meals that served as informal coordination hubs. Residents shared information about FEMA applications, contractor recommendations, and childcare swaps — all while eating gumbo together under tents." },
      { type: 'stat', stat: '47,000', label: 'Meals served during disaster recovery efforts' },
      { type: 'paragraph', content: "Looking ahead, the organization is piloting 'Digital Gatherings' — virtual events designed to replicate the unstructured intimacy of in-person meetups. Early results from the beta program show promise: 68% of virtual attendees report forming at least one meaningful new connection, compared to 74% at physical events. The gap is narrowing." },
    ],
    relatedSlugs: ['volunteer-programs', 'youth-futures'],
  },
  {
    slug: 'volunteer-programs',
    title: 'Volunteer Programs',
    subtitle: 'Matching 12,000+ active volunteers with causes that need them most — one skill at a time',
    heroImage: 'https://images.pexels.com/photos/5029923/pexels-photo-5029923.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Volunteerism',
    date: 'February 2025',
    author: 'James Chen',
    authorRole: 'Volunteer Coordinator, Seattle WA',
    readTime: '5 min read',
    sections: [
      { type: 'paragraph', content: "James Chen was a software engineer who felt disconnected from his community. He had skills — serious ones — but no clear path to apply them where they mattered. Then he discovered CommonGround's SkillMatch platform, which pairs volunteers with organizations based on professional expertise rather than generic availability." },
      { type: 'quote', content: "I spent five years building apps for ad tech. Now I build inventory systems for food banks. Same skills, completely different impact." },
      { type: 'paragraph', content: "The SkillMatch algorithm is deceptively simple. Volunteers complete a 10-minute profile covering their professional skills, availability, and causes they care about. Organizations post specific needs — 'need a CPA to review our 990 form' or 'looking for a graphic designer for our annual report.' The system makes matches based on skill overlap, geographic proximity, and time commitment compatibility." },
      { type: 'stat', stat: '12,400+', label: 'Active volunteers in the network' },
      { type: 'paragraph', content: "What surprised the founders was the retention rate. Traditional volunteer programs see an average annual turnover of 65%. CommonGround's SkillMatch volunteers have a 23% turnover rate. The difference? People stay when the work uses their actual expertise. A retired accountant who reviews nonprofit budgets feels valued in a way that stuffing envelopes never could." },
      { type: 'image', src: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Volunteers at a community garden build in Denver, Colorado' },
      { type: 'heading', content: 'From Transaction to Relationship' },
      { type: 'paragraph', content: "The platform also tracks 'relationship depth' — a metric that measures how many times a volunteer and organization have worked together. Volunteers with three or more repeat engagements report 4.2x higher satisfaction scores than one-time participants. This insight led to the creation of 'Fellowships' — six-month commitments where a volunteer essentially embeds with an organization as a part-time consultant." },
      { type: 'paragraph', content: "Sarah Kim, a marketing director at a mid-size tech company, completed a Fellowship with a youth literacy nonprofit in Chicago. She overhauled their social media strategy, trained two staff members on analytics tools, and helped secure a $50,000 grant by rewriting their impact narrative. 'It was the most meaningful work I did all year,' she says. 'And it was 4 hours a week.'" },
      { type: 'stat', stat: '340', label: 'Active Fellowships across 28 cities' },
      { type: 'paragraph', content: "The program is now expanding into 'Crisis Response Teams' — pre-vetted volunteers who can deploy within 48 hours of a natural disaster or community emergency. The first team activated during the 2024 California wildfires, providing logistics coordination, communications support, and mental health first aid to evacuation centers." },
    ],
    relatedSlugs: ['community-events', 'skills-workshops'],
  },
  {
    slug: 'skills-workshops',
    title: 'Skills Workshops',
    subtitle: 'Free workshops on financial literacy, digital skills, and career development — taught by the community, for the community',
    heroImage: 'https://images.pexels.com/photos/19895774/pexels-photo-19895774.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Education',
    date: 'January 2025',
    author: 'Aisha Johnson',
    authorRole: 'Workshop Director, Atlanta GA',
    readTime: '7 min read',
    sections: [
      { type: 'paragraph', content: "Aisha Johnson never planned to become an educator. She was a financial analyst at a Fortune 500 company who happened to be good at explaining complex concepts in simple terms. When a friend asked her to lead a budgeting workshop at a local community center, she said yes reluctantly. Forty people showed up. Fifty showed up to the next one. Now she leads a team of 85 volunteer instructors across the Southeast." },
      { type: 'quote', content: "The most powerful thing we teach is not Excel or resume writing. It is the belief that you are capable of learning anything." },
      { type: 'paragraph', content: "CommonGround's Skills Workshop program operates on a 'teach what you know, learn what you need' model. Anyone can propose a workshop. Anyone can attend. The curriculum is crowdsourced from the community itself, which means it stays relevant to actual local needs rather than abstract national trends." },
      { type: 'stat', stat: '8,200+', label: 'Workshop participants in 2024' },
      { type: 'paragraph', content: "The most popular workshops are not what you might expect. Yes, digital literacy and job search skills draw crowds. But so do 'How to Start a Food Business from Your Home Kitchen,' 'Understanding Your Tenant Rights,' and 'Navigating Healthcare Enrollment.' These are survival skills for modern life, and they are rarely taught in traditional classrooms." },
      { type: 'image', src: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'A financial literacy workshop in progress at the Atlanta Community Center' },
      { type: 'heading', content: 'The Ripple Effect' },
      { type: 'paragraph', content: "The workshops create unexpected cascades of impact. A participant in a budgeting class starts tracking expenses, discovers they qualify for an earned income tax credit, files their taxes correctly for the first time, and receives a $3,200 refund. They use part of it to enroll in a certification program they learned about at another workshop. Six months later, they have a new job earning $15,000 more annually." },
      { type: 'paragraph', content: "This is not a hypothetical. It is the documented trajectory of 340 workshop alumni who participated in a longitudinal study conducted by Georgia State University. The average income increase among participants who attended three or more workshops was $11,400 after 18 months. The cost per participant to CommonGround? $23." },
      { type: 'stat', stat: '$23', label: 'Average cost per workshop participant' },
      { type: 'paragraph', content: "The program is now experimenting with 'Workshop Circles' — small groups of 6-8 people who meet weekly for 12 weeks to work through a curriculum together with a dedicated facilitator. Early results show 3x higher completion rates compared to drop-in workshops. The accountability of a cohort, it turns out, is as important as the content itself." },
    ],
    relatedSlugs: ['mentorship-circles', 'volunteer-programs'],
  },
  {
    slug: 'mentorship-circles',
    title: 'Mentorship Circles',
    subtitle: 'Over 3,400 active mentorship pairs across 28 cities — proving that guidance changes everything',
    heroImage: 'https://images.pexels.com/photos/5917718/pexels-photo-5917718.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Mentorship',
    date: 'March 2025',
    author: 'David Park',
    authorRole: 'Mentorship Program Lead, San Francisco CA',
    readTime: '6 min read',
    sections: [
      { type: 'paragraph', content: "David Park was 22, unemployed, and sleeping on his cousin's couch in the Bayview district of San Francisco when he met his mentor, Robert Henderson, through a CommonGround Mentorship Circle. Robert was a retired civil engineer who had spent 30 years building bridges — literal ones — and was now building something else: connections between generations." },
      { type: 'quote', content: "Robert did not give me a job. He gave me a map. He showed me where the doors were, but he made me open them myself." },
      { type: 'paragraph', content: "That was seven years ago. Today, David is a project manager at a renewable energy firm and a mentor himself. He meets with his mentee, a 19-year-old named Marcus, every Thursday at the same coffee shop where he first met Robert. The table has become something of a sacred space — three generations of guidance passing through the same chairs." },
      { type: 'stat', stat: '3,400+', label: 'Active mentorship pairs across 28 cities' },
      { type: 'paragraph', content: "CommonGround's Mentorship Circles are structured differently from traditional one-on-one programs. Each 'Circle' consists of 4-6 mentor-mentee pairs who meet as a group monthly, in addition to individual sessions. This design creates a network effect: mentees learn from multiple mentors, and mentors learn from each other's approaches. The group dynamic also reduces the pressure on any single relationship to provide everything." },
      { type: 'image', src: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'A Mentorship Circle meeting in San Francisco — mentors and mentees share progress updates' },
      { type: 'heading', content: 'The 90-Day Commitment' },
      { type: 'paragraph', content: "New pairs commit to just 90 days initially — a low barrier that reduces anxiety on both sides. After 90 days, they can renew, re-match, or graduate. Surprisingly, 78% of pairs choose to renew. The ones that do not usually re-match with someone new rather than dropping out entirely. The program treats mentorship as a practice, not a lifetime contract." },
      { type: 'paragraph', content: "The matching algorithm considers personality assessments, career goals, communication preferences, and even hobbies. A mentor who loves hiking might be paired with a mentee who needs confidence building — their first meeting might be a trail walk rather than a coffee shop conversation. These contextual matches produce 40% higher satisfaction scores than purely professional pairings." },
      { type: 'stat', stat: '78%', label: 'Of pairs renew after the initial 90-day commitment' },
      { type: 'paragraph', content: "The program is now piloting 'Reverse Mentorship' tracks, where younger professionals mentor older adults on digital skills, social media, and navigating modern workplace culture. Early feedback suggests these pairings are among the most transformative — both parties report learning more than they expected." },
    ],
    relatedSlugs: ['skills-workshops', 'youth-futures'],
  },
  {
    slug: 'solidarity',
    title: 'Solidarity',
    subtitle: 'When communities stand together, they become unbreakable — the story of our collective strength',
    heroImage: 'https://images.pexels.com/photos/33996047/pexels-photo-33996047.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Movement',
    date: 'April 2025',
    author: 'Elena Rodriguez',
    authorRole: 'Solidarity Campaign Director, Phoenix AZ',
    readTime: '5 min read',
    sections: [
      { type: 'paragraph', content: "Elena Rodriguez grew up in a neighborhood where solidarity was not a concept — it was a survival strategy. When her family's car broke down, neighbors drove her father to work. When her grandmother got sick, the block organized a meal train that lasted six months. She did not know the word 'solidarity' until college, but she had lived it every day of her childhood." },
      { type: 'quote', content: "Solidarity is not charity. Charity is vertical — it goes from the haves to the have-nots. Solidarity is horizontal. It is people standing shoulder to shoulder, recognizing that their struggles are connected." },
      { type: 'paragraph', content: "When Elena joined CommonGround in 2020, she brought this philosophy with her. She launched the Solidarity Campaign, a framework for communities to identify shared challenges and coordinate collective responses. The first campaign focused on eviction prevention in Phoenix, where 1,200 families were facing displacement during the pandemic." },
      { type: 'stat', stat: '1,200', label: 'Families protected from eviction in the first campaign' },
      { type: 'paragraph', content: "The campaign worked because it was not top-down. CommonGround provided the coordination infrastructure — a shared database, communication tools, and training — but the strategy came from the community. Tenant organizers, legal aid clinics, faith groups, and mutual aid networks all contributed their expertise. No single organization could have done it alone." },
      { type: 'image', src: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Community members at a solidarity rally in downtown Phoenix' },
      { type: 'heading', content: 'The Network Effect' },
      { type: 'paragraph', content: "The Solidarity Campaign model has since been replicated in 18 cities, addressing issues from food insecurity to immigration support to climate resilience. Each campaign is locally designed but nationally supported — CommonGround chapters share playbooks, lessons learned, and connections to national resources." },
      { type: 'paragraph', content: "What makes the model unique is its emphasis on 'power mapping' — a process where communities collectively identify who has decision-making power over the issues that affect them, and then build relationships with those decision-makers. It is advocacy, but it is also relationship-building. The goal is not to win a single battle, but to change the power dynamics permanently." },
      { type: 'stat', stat: '18', label: 'Cities running active Solidarity Campaigns' },
      { type: 'paragraph', content: "The next frontier is 'Digital Solidarity' — using technology to connect geographically dispersed communities facing similar challenges. A rural farming community in Iowa and an urban neighborhood in Detroit might both be dealing with water contamination. CommonGround is building platforms for them to share solutions, lawyers, and political strategies across distance." },
    ],
    relatedSlugs: ['community-events', 'volunteer-programs'],
  },
  {
    slug: 'youth-futures',
    title: 'Youth Futures',
    subtitle: 'Investing in the next generation of changemakers — because the future belongs to those who prepare for it',
    heroImage: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Youth',
    date: 'March 2025',
    author: 'Tyrell Washington',
    authorRole: 'Youth Programs Director, Chicago IL',
    readTime: '6 min read',
    sections: [
      { type: 'paragraph', content: "Tyrell Washington was 16 when he first walked into a CommonGround Youth Lab. He was skeptical — another program promising to 'empower' young people, full of adults talking at him instead of with him. But the Youth Lab was different. The first thing they asked was: 'What do you want to change about your neighborhood?' Tyrell said: 'The empty lot on my block. It is an eyesore and a hazard.' The facilitator said: 'Okay. Let's figure out how to fix it.'" },
      { type: 'quote', content: "They did not tell me what to do. They asked me what I wanted to do, and then they helped me learn how to do it. That difference changed my life." },
      { type: 'paragraph', content: "Three years later, that empty lot is a community garden with 24 raised beds, a composting system, and a youth-run farmers market that generates $8,000 in annual revenue. Tyrell, now 19, is the garden's coordinator and a paid Youth Fellow at CommonGround. He is also applying to urban planning programs, a path he never considered before the Youth Lab." },
      { type: 'stat', stat: '4,100+', label: 'Youth participants in 2024' },
      { type: 'paragraph', content: "The Youth Futures program operates on a 'project-based, youth-led' model. Participants identify a problem in their community, design a solution, and implement it with adult mentors serving as coaches rather than directors. The projects range from small — a neighborhood cleanup, a tutoring program — to ambitious: a youth council that successfully lobbied the city council for a new skate park, or a team that built a solar-powered phone charging station for unhoused neighbors." },
      { type: 'image', src: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200', caption: 'Youth Fellows presenting their community garden project to local stakeholders' },
      { type: 'heading', content: 'From Projects to Pathways' },
      { type: 'paragraph', content: "The program is designed as a pipeline. Middle schoolers join 'Discovery Labs' — short, exploratory sessions that introduce them to community issues and basic skills. High schoolers move into 'Action Teams' — sustained projects with dedicated mentors. Young adults (18-24) can apply for 'Fellowships' — paid, year-long positions that provide professional development, networking, and real responsibility." },
      { type: 'paragraph', content: "The Fellowship model is particularly innovative. Fellows are not interns doing grunt work. They are program coordinators, event planners, communications managers, and community organizers. They attend staff meetings, make decisions, and manage budgets. The goal is to provide resume-worthy experience that also builds genuine leadership capacity." },
      { type: 'stat', stat: '89%', label: 'Of Youth Fellows pursue higher education or career-track employment' },
      { type: 'paragraph', content: "The program is now expanding into 'Youth Policy Labs' — spaces where young people research, draft, and advocate for policy changes at the city and state level. The first cohort in Chicago is working on a proposal for participatory budgeting in public schools, giving students a direct voice in how school funds are allocated. They are not waiting for permission to lead. They are just leading." },
    ],
    relatedSlugs: ['skills-workshops', 'mentorship-circles'],
  },
];