import React, { useState, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Container, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './FAQ.css';

const FAQs: React.FC = () => {
  const faqData = [
    {
      question: 'How do I log in as an employee?',
      answer: 'You can log in using your employee ID and password on the login page.',
    },
    {
      question: 'How do I clock in and out?',
      answer: 'After logging in, you will see a clock in/out button on the dashboard. Click on the button to clock in or out.',
    },
    {
      question: 'How do I view my attendance records?',
      answer: 'You can view your attendance records on the dashboard after logging in. The records will show your clock in and out times for each day.',
    },
    {
      question: 'How do I generate an attendance report?',
      answer: 'Administrators can generate attendance reports using the reporting tools in the dashboard. Select the date range and click on the generate report button.',
    },
    {
      question: 'What should I do if I forget my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions on how to reset your password.',
    },
    {
      question: 'How can I contact support?',
      answer: 'For support, please send an email to mailto:support@your-company.com. Our support team will get back to you as soon as possible.',
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const centerFaqPage = () => {
      const faqContainer = document.getElementById('faq-container');
      if (faqContainer) {
        const marginLeft = (window.innerWidth - faqContainer.offsetWidth) / 2;
        faqContainer.style.marginLeft = `${marginLeft}px`;
      }
    };

    centerFaqPage();
    window.addEventListener('resize', centerFaqPage);

    return () => {
      window.removeEventListener('resize', centerFaqPage);
    };
  }, []);

  return (
    <Container
      maxWidth="md"
      className="faq-container unique-faq-container"
      id="faq-container"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={10} style={{ padding: '30px', marginBottom: '20px', width: '85%', marginTop:'100px', marginRight:'280px', marginLeft:'50px', border: '4px solid #0f4c82'}}>
        <Typography variant="h4" align="center" gutterBottom className="faq-heading" style={{ color: '#3498db', fontWeight:'bold' }}>
          Frequently Asked Questions
        </Typography>
        {faqData.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expandedIndex === index}
            onChange={() => handleToggle(index)}
            style={{
              border: '2px solid #3498db',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={expandedIndex === index ? faAngleUp : faAngleDown} className="faq-icon" />}
              aria-controls={`faqCollapse${index}`}
              id={`faqHeading${index}`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
};

export default FAQs;
