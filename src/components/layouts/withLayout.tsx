import React from 'react';

export const withLayout = (WrappedComponent: React.ComponentType, Layout: React.ComponentType<{children: React.ReactNode}>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WithLayoutComponent(props: any) {
    return (
      <Layout>
        <WrappedComponent {...props} />
      </Layout>
    );
  };
};

// Usage in routes:
// const CustomPageWithAdminLayout = withLayout(YourPageComponent, AdminLayout);

// // Then in your Routes:
// <Route path="/custom-page" element={<CustomPageWithAdminLayout />} />