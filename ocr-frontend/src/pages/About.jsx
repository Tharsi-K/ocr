import React from 'react';
import '@fontsource/noto-sans-tamil'; // Defaults to weight 400

export default function About() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <br />
      <h1 style={{ color: '#06b6d4', fontSize: '20px' }}>About Us</h1>
      <p style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        Welcome to our Tamil OCR system! Our platform is designed to convert images, pdf containing Tamil text 
        into editable and searchable digital text. Whether it’s scanned documents, handwritten notes, or 
        printed books, you can easily transform them into a digital format using this platform.
        Users can upload books, evaluate them, and make them accessible to everyone after review.
      </p>

      <br />
      <h2 style={{ color: '#1e40af', fontSize: '20px' }}>Our Mission</h2>
      <p style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        Our mission is to make traditional Tamil content easily accessible in a digital format, 
        preserving the richness of Tamil literature for the future. We aim to safeguard old books and 
        pass them on to the next generation.
      </p>

      <br />
      <h2 style={{ color: '#1e40af', fontSize: '20px' }}>Features</h2>
      <ul style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        <li>Accurate text conversion for printed and handwritten Tamil text.</li>
        <li>Support for multiple image formats, including PNG, JPEG, and TIFF.</li>
        <li>Book upload functionality for users.</li>
        <li>Reviewed books become accessible to everyone.</li>
        <li>Read books digitally after successful review.</li>
      </ul>

      <br />
      <h2 style={{ color: '#1e40af', fontSize: '20px' }}>Why Choose Us?</h2>
      <p style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        We understand the importance of the Tamil language. Our OCR platform not only helps preserve 
        Tamil language and literature but also provides a gateway to the digital world. Whether you are 
        a researcher, teacher, or someone looking to digitize your documents, our platform is here to help you.
      </p>

      <br />
      <h2 style={{ color: '#06b6d4', fontSize: '20px' }}>Getting Started</h2>
      <p style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        To access all features:
        <ul>
          <li><strong>Sign In</strong> if you already have an account.</li>
          <li><strong>Sign Up</strong> if you are new to the platform.</li>
          <li>Or, continue quickly with <strong>Google Authentication</strong>.</li>
        </ul>
      </p>

      <br />
      <h2 style={{ color: '#1e40af', fontSize: '20px' }}>User Account Features</h2>
      <ul style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        <li>Update your <strong>Email</strong>, <strong>Username</strong>, and <strong>Password</strong> from your profile.</li>
        <li>Delete your account anytime if needed.</li>
        <li>Add and view books that you have uploaded.</li>
      </ul>

      <br />
      <h2 style={{ color: '#1e40af', fontSize: '20px' }}>Admin Panel</h2>
      <p style={{ fontSize: '16px', padding: '5px 20px 5px 25px' }}>
        The <strong>Admin Panel</strong> is accessible only to administrators. Admins can:
        <ul>
          <li>View the dashboard.</li>
          <li>Manage all uploaded books.</li>
          <li>Manage user accounts.</li>
        </ul>
      </p>

      <p style={{ marginTop: '20px', padding: '5px 20px 5px 25px' }}>
        <strong>Thank you for choosing our Tamil OCR system!</strong> If you have any questions or suggestions, 
        feel free to contact us. Join us in preserving linguistic heritage while embracing a digital future.
      </p>
    </div>
  );
}

