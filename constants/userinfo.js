//PLEASE FOLLOW THE FORMAT OF THIS FILE.

import {
  faGithub,
  faLinkedinIn,
  faMediumM,
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export const userinfo = {
  logoText: "Khizar Ali", //This text is visible on your navbar and footer like your logo.
  contact: {
    email: "khizarali.cs@gmail.com", //It is always a good idea to mention your email on your website. Good platform to communicate.
    phone: "3107860806", //Phone number is optional, if you dont want it, consider leaving it blank .
    countrycode: "+92", //It is advisable to add the country code incase you mention your contact number.
  },
  socials: [
    {
      type: "github",
      link: "https://github.com/Khizarali07",
      icon: faGithub,
    },
    {
      type: "linkedin",
      link: "https://www.linkedin.com/in/hafiz-m-khizar-ali/",
      icon: faLinkedinIn,
    },

    {
      type: "Instagram",
      social: true,
      link: "https://www.instagram.com/khizar.ali07?igsh=bzcwaWQyYmVxc2xk",
      icon: faInstagram,
    },
    {
      type: "Facebook",
      social: true,
      link: "https://www.facebook.com/share/14i7hUgLpW/",
      icon: faFacebook,
    },
  ],
  greeting: {
    title: "Hey there, I am Khizar Ali.",
    subtitle:
      "I am a hardworking and resilient BSCS student in my 7th semester, passionate about web development, mobile app development with React Native, and C++ programming. A problem solver at heart, I'm on a journey to turn challenges into creative solutions and kickstart my freelance career.",
  },
  capabilities: [
    {
      category: "Frontend Development",
      skills: ["Next.js", "React.js", "HTML", "CSS"],
    },
    {
      category: "Backend Development",
      skills: ["Node.js", "Express.js", "MongoDB"],
    },
    {
      category: "Mobile App Development",
      skills: ["React Native", "XML", "Java"],
    },
    {
      category: "Programming Languages",
      skills: ["C++", "JavaScript", "Python"],
    },
  ],

  about: {
    // This text goes at the bottom of your home page.
    content:
      "I am Khizar Ali, a 7th-semester BSCS student passionate about web development (MERN stack), mobile app development (React Native, XML, Java), and programming in C++. Currently enhancing my skills in Next.js, I thrive on solving challenges and delivering impactful solutions. Let’s connect and bring your ideas to life.",
    resume:
      "https://drive.google.com/file/d/12MK9isYv2W-DOJsx5N4cJfII9kzwvRXr/view?usp=sharing", // link your resume here. It can be a drive link or any other link.
  },
  education: {
    visible: true, // Set this to false if you want to omit this section
    educationList: [
      {
        time: "2021 - 2025", // Timespan
        title: "Bachelor of Science in Computer Science (BSCS)", // Corrected capitalization
        organization: "Minhaj University Lahore", // Organization name
        description: "Currently in the 7th semester with a CGPA of 4.49.", // Corrected grammar
      },
      {
        time: "2019 - 2021",
        title: "Intermediate in Pre-Engineering", // Expanded and clarified title
        organization: "Unique College Lahore",
        description:
          "Focused on mathematics, physics, and chemistry, laying the foundation for my career in computer science.",
      },
      {
        time: "2017 - 2019",
        title: "Matriculation in Science",
        organization: "Jouhar Foundation High School",
        description:
          "Excelled in core science subjects, fostering my interest in technology and problem-solving.",
      },
    ],
  },
  experience: {
    visible: true, // Set this to false if you want to omit this section
    experienceList: [
      {
        company: "Softaxe",
        companylogo:
          "https://media.licdn.com/dms/image/v2/C560BAQFMrWtdExKzbg/company-logo_200_200/company-logo_200_200/0/1661932976650?e=2147483647&v=beta&t=GLacYa6t1nF2y9JqRiudUnVooWoJ0yXjbKnKheCwPaY", // Replace with the company logo URL
        position: "Web Developer Intern",
        time: "September 2024 - November 2024",
        description:
          "Worked on web development projects using the MERN stack, contributed to developing and deploying scalable applications, and collaborated with the team to improve user experience and performance.",
      },
      {
        company: "Internship Pakistan",
        companylogo:
          "https://media.licdn.com/dms/image/v2/D4D0BAQEnlASYAjyn7A/img-crop_100/img-crop_100/0/1724985537785?e=1745452800&v=beta&t=vvPy89fOb5Nu-jGQYv078SoPW4UiUQtqBhYbKIh9sgY", // Replace with the company logo URL
        position: "Graphic Designer Intern",
        time: "January 2024 - Present",
        description:
          "Designed engaging and creative visual content, collaborated on marketing campaigns, and developed branding materials to enhance the company's digital presence.",
      },
    ],
  },

  blogs: {
    //set this to false if you want to omit this section
    visible: false,
  },
};

export const headings = {
  //you can customise all the headings here.
  workHomePage: "Work",
  workMainPage: "Projects",
  capabilities: "Capabilities",
  about: "About Me",
  education: "Education",
  experience: "Experiences",
  blogs: "I write!",
  contact: "Contact us",
};

export const ctaTexts = {
  //you can customise all the cta texts here.
  landingCTA: "My work",
  workCTA: "View All",
  capabCTA: "Get in Touch",
  educationCTA: "About Me",
  resumeCTA: "Resume",
  submitBTN: "Submit",
};
