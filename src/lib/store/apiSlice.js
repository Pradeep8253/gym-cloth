import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => {
        let url = '/products';
        if (params) {
          const searchParams = new URLSearchParams();
          Object.keys(params).forEach(key => {
            if (params[key]) searchParams.append(key, params[key]);
          });
          if (searchParams.toString()) url += `?${searchParams.toString()}`;
        }
        return url;
      },
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getUserProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getAllOrders: builder.query({
      query: () => '/orders/all',
      providesTags: ['Order'],
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUserProfileQuery,
  useGetOrdersQuery,
  useGetAllOrdersQuery,
  useGetAllUsersQuery,
  useCreateOrderMutation,
} = apiSlice;
