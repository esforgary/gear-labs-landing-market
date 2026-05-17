import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Mail,
  Play,
  Search,
  Star,
  Users,
} from "lucide-react";
import "./education-platform.scss";

const asset = (name) => new URL(`./img/${name}`, import.meta.url).href;

const courseImages = [
  asset("course-1.jpg"),
  asset("course-2.jpg"),
  asset("course-3.jpg"),
  asset("course-4.jpg"),
  asset("course-5.jpg"),
  asset("course-6.jpg"),
];

const portraitImages = [
  asset("hero-student.png"),
  asset("promo-woman-1.jpg"),
  asset("promo-woman-2.jpg"),
  asset("contact-student.jpg"),
  asset("final-student.jpg"),
];

const categoryImages = [
  asset("category-1.jpg"),
  asset("category-2.jpg"),
  asset("category-3.jpg"),
  asset("category-4.jpg"),
];

const popularImages = [
  asset("popular-1.jpg"),
  asset("popular-2.jpg"),
  asset("popular-3.jpg"),
  asset("popular-4.jpg"),
];

const courses = [
  { title: "Communication Skills", tag: "Management", price: "$19.00", image: courseImages[0] },
  { title: "Complete Web Design", tag: "Design", price: "$29.00", image: courseImages[1] },
  { title: "Business Development", tag: "Business", price: "$25.00", image: courseImages[2] },
  { title: "Digital Marketing", tag: "Marketing", price: "$18.00", image: courseImages[3] },
  { title: "Leadership Practice", tag: "Strategy", price: "$32.00", image: courseImages[4] },
  { title: "Creative Thinking", tag: "Creative", price: "$21.00", image: courseImages[5] },
];

const categories = [
  { title: "Design", value: "18 courses" },
  { title: "Development", value: "24 courses" },
  { title: "Business", value: "16 courses" },
  { title: "Marketing", value: "20 courses" },
];

const popular = [
  "Web Development",
  "Digital Marketing",
  "UI/UX Design",
  "Business Analysis",
];

function CourseCard({ course, compact = false }) {
  return (
    <article className={`figma-course-card ${compact ? "compact" : ""}`}>
      <div className="figma-course-image">
        <img src={course.image} alt={course.title} />
        <span><Star size={13} /> 4.8</span>
      </div>
      <div className="figma-course-content">
        <small>{course.tag}</small>
        <h3>{course.title}</h3>
        <div>
          <span><Clock3 size={13} /> 8 weeks</span>
          <span><Users size={13} /> 1.2k</span>
        </div>
        <strong>{course.price}</strong>
      </div>
    </article>
  );
}

function PromoBlock({ reverse = false, title, text, image, eyebrow }) {
  return (
    <section className={`figma-promo ${reverse ? "reverse" : ""}`}>
      <div className="figma-promo-image">
        <img src={image} alt="" />
        <span><Check size={14} /> Certified</span>
      </div>
      <div className="figma-promo-copy">
        <small>{eyebrow}</small>
        <h2>{title}</h2>
        <p>{text}</p>
        <button type="button">Get Started</button>
      </div>
    </section>
  );
}

export default function EducationPlatform() {
  const [sent, setSent] = useState(false);

  return (
    <main className="figma-edu-page">
      <div className="figma-top-shell">
        <header className="figma-edu-header">
          <a href="#figma-home" className="figma-edu-logo">MEC.</a>
          <nav aria-label="Educational platform navigation">
            <a href="#figma-courses">Courses</a>
            <a href="#figma-about">About</a>
            <a href="#figma-mentors">Mentors</a>
            <a href="#figma-contact">Contact</a>
          </nav>
          <button type="button">Login</button>
        </header>
        <section className="figma-hero" id="figma-home">
          <div className="figma-hero-copy">
            <span className="figma-pill">Online learning platform</span>
            <h1>A Classical Education for the <span>Future</span></h1>
            <p>
              Build your skills with practical online classes, experienced mentors and a supportive
              community that helps you keep moving.
            </p>
            <div className="figma-hero-actions">
              <a href="#figma-courses">Get Started</a>
              <button type="button"><Play size={16} /> Watch Video</button>
            </div>
          </div>
          <div className="figma-hero-person">
            <div className="figma-hero-person-circle">
              <img src={portraitImages[0]} alt="Student with backpack" />
            </div>
            <div className="figma-hero-card">
              <span>12k+</span>
              <small>Happy students</small>
            </div>
          </div>
        </section>
      </div>

      <section className="figma-stats" aria-label="Platform numbers">
        <article><strong>10k+</strong><span>Students enrolled</span></article>
        <article><strong>250+</strong><span>Expert mentors</span></article>
        <article><strong>120+</strong><span>Online courses</span></article>
      </section>

      <section className="figma-section" id="figma-courses">
        <div className="figma-section-head centered">
          <small>Top Categories</small>
          <h2>Our Popular Categories</h2>
        </div>
        <div className="figma-category-grid">
          {categories.map((category, index) => (
            <article key={category.title}>
              <BookOpen size={24} />
              <strong>{category.title}</strong>
              <span>{category.value}</span>
              <img src={categoryImages[index]} alt="" />
            </article>
          ))}
        </div>
      </section>

      <PromoBlock
        eyebrow="What we offer"
        title={<>We are <mark>Experts</mark> Learning Institution</>}
        text="Access guided lessons, assignments and mentor reviews designed to help every student learn faster and build a visible portfolio."
        image={portraitImages[1]}
      />

      <section className="figma-section">
        <div className="figma-section-head centered">
          <small>Explore all courses</small>
          <h2>Explore Our Popular Online Courses</h2>
          <a href="#figma-courses">View all</a>
        </div>
        <div className="figma-course-grid">
          {courses.map((course) => <CourseCard course={course} key={course.title} />)}
        </div>
      </section>

      <PromoBlock
        reverse
        eyebrow="Why choose us"
        title={<>Our online <mark>community</mark> in education</>}
        text="Our platform combines video lessons, practical projects, feedback sessions and community groups in one friendly learning space."
        image={portraitImages[2]}
      />

      <section className="figma-section">
        <div className="figma-section-head centered">
          <small>Popular subjects</small>
          <h2>Learn our most popular course categories</h2>
        </div>
        <div className="figma-popular-row">
          {popular.map((item, index) => (
            <article key={item}>
              <img src={popularImages[index]} alt="" />
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="figma-contact" id="figma-contact">
        <div className="figma-contact-person">
          <img src={portraitImages[2]} alt="" />
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <small>Get free consultation</small>
          <h2>Need help choosing a program?</h2>
          <input aria-label="Name" placeholder="Your name" />
          <input aria-label="Email" placeholder="Email address" />
          <textarea aria-label="Message" placeholder="Tell us about your goal" />
          <button type="submit"><Mail size={16} /> Send Request</button>
          {sent && <p>Request sent in demo mode.</p>}
        </form>
      </section>

      <section className="figma-section">
        <div className="figma-section-head centered">
          <small>Find your course</small>
          <h2>Find your popular online course</h2>
        </div>
        <div className="figma-popular-row">
          {courses.slice(2, 6).map((course) => <CourseCard compact course={course} key={course.title} />)}
        </div>
      </section>

      <section className="figma-final-cta">
        <div>
          <small>Start today</small>
          <h2>Your future starts from best online resources</h2>
          <p>Join thousands of students who learn with mentors, courses and a helpful community.</p>
          <a href="#figma-contact">Join now <ArrowRight size={16} /></a>
        </div>
        <img src={portraitImages[4]} alt="" />
      </section>

      <section className="figma-section" id="figma-mentors">
        <div className="figma-section-head centered">
          <small>Popular instructors</small>
          <h2>Meet our best instructors</h2>
        </div>
        <div className="figma-mentor-grid">
          {portraitImages.slice(1).map((image, index) => (
            <article key={image}>
              <img src={image} alt="" />
              <strong>{["Leslie Alexander", "Kristin Watson", "Wade Warren", "Robert Fox"][index]}</strong>
              <span>{["UI Mentor", "Marketing Coach", "Business Tutor", "Code Teacher"][index]}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="figma-testimonials">
        <div className="figma-section-head centered">
          <small>reviews</small>
          <h2>What Our Student Says About us</h2>
        </div>
        <div className="figma-testimonial-grid">
          {["William Sam", "Brooklyn Simmons", "Jenny Wilson"].map((name, index) => (
            <article key={name}>
              <strong>{name}</strong>
              <span>{["$430.00", "$320.00", "$250.00"][index]}</span>
              <p>Lessons are clear, mentors answer quickly and the weekly tasks helped me finish my first real project.</p>
            </article>
          ))}
        </div>
        <div className="figma-logo-strip" aria-label="Partner logos">
          <span>slack</span>
          <span>loom</span>
          <span>blend</span>
          <span>notion</span>
          <span>zoom</span>
        </div>
      </section>

      <section className="figma-newsletter">
        <h2>Subscribe to our newsletter</h2>
        <div>
          <Search size={16} />
          <input aria-label="Newsletter email" placeholder="Enter your email" />
          <button type="button">Subscribe</button>
        </div>
      </section>

      <footer className="figma-footer">
        <div>
          <strong>MEC.</strong>
          <p>Online education for your future.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#figma-home">Home</a>
          <a href="#figma-courses">Courses</a>
          <a href="#figma-about">About</a>
          <a href="#figma-contact">Contact</a>
        </nav>
        <span>Copyright 2026</span>
      </footer>
    </main>
  );
}
