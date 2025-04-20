import React from 'react';
import PageContainer from '@/components/PageContainer';
import Breadcrumb from '@/components/Breadcrumb';
import BlogFront from './blog/BlogFront';

export default function Blog() {
  return (
    <PageContainer>
      <Breadcrumb 
        items={[
          { label: 'Blog', path: '/blog', isActive: true }
        ]} 
      />
      <BlogFront />
    </PageContainer>
  );
}