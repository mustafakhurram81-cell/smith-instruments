import React from 'react';

export interface NavItem {
  label: string;
  path: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  location: string;
  role: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ValueProp {
  title: string;
  description: string;
  icon: React.ElementType;
}