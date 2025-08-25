"use client";

import { useState } from "react";
import styles from "@/styles/Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { userinfo, headings, ctaTexts } from "@/constants/userinfo";
import { createMessage } from "@/lib/actions/messageActions";
import { toast } from "sonner";

const Contact = ({ currentUser }) => {
  const [name, setName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Save message to database (if configured)
      const messageData = {
        userId: currentUser.$id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      };

      try {
        await createMessage(messageData);
        console.log("Message saved to database");
      } catch (dbError) {
        console.log(
          "Database save failed (this is okay if messages collection isn't set up):",
          dbError.message
        );
      }

      // Send email notification (existing API)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.status === 200) {
        console.log("Email sent successfully!");
      }

      // Reset form and show success
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSubmitted(true);

      toast.success(
        "Your message has been sent successfully! We'll get back to you soon."
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.contactWrapper}>
      <div className={styles.contactHeading}>
        <h1 className="text-2xl font-bold mb-4">{headings.contact}</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={name}
            required
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            required
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={phone}
            autoComplete="off"
            onChange={(e) => setPhone(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputWrapper}>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            placeholder="If you face any problem contact us"
            name="message"
            value={message}
            required
            autoComplete="off"
            onChange={(e) => setMessage(e.target.value)}
            className={styles.textArea}
          />
        </div>

        <div className={styles.submit}>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-[100%] bg-[#4A90E2] text-white p-4 rounded-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#357ABD]"
            }`}
          >
            {isLoading ? "Sending..." : ctaTexts.submitBTN}
          </button>
        </div>
      </form>

      <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
        <Link href={`mailto:${userinfo.contact.email || ""}`}>
          {userinfo.contact.email}
        </Link>
      </div>

      {userinfo.contact.phone && (
        <div style={{ textAlign: "center", paddingTop: "0.2rem" }}>
          <Link
            href={`tel:${userinfo.contact.countrycode}${userinfo.contact.phone}`}
          >
            {`${userinfo.contact.countrycode}${userinfo.contact.phone}`}
          </Link>
        </div>
      )}

      <div className={styles.socialIconDiv}>
        {userinfo.socials &&
          userinfo.socials.map((social, key) => {
            return (
              <div className={styles.socialIcon} key={key}>
                <Link href={social.link}>
                  <FontAwesomeIcon icon={social.icon} />
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Contact;
