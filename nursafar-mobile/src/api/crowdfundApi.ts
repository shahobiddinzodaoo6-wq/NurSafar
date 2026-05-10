import { baseApi } from "../store/baseApi";
import type {
  CrowdfundCampaign,
  CampaignDetail,
  Donation,
  CreateCampaignPayload,
  DonatePayload,
} from "../types";

export const crowdfundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<CrowdfundCampaign[], void>({
      query: () => "/crowdfund",
      providesTags: ["Campaigns"],
    }),
    getCampaignById: builder.query<CampaignDetail, string>({
      query: (id) => `/crowdfund/${id}`,
      providesTags: ["Campaigns"],
    }),
    createCampaign: builder.mutation<CrowdfundCampaign, CreateCampaignPayload>({
      query: (body) => ({
        url: "/crowdfund",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Campaigns"],
    }),
    donate: builder.mutation<Donation, DonatePayload>({
      query: ({ id, ...body }) => ({
        url: `/crowdfund/${id}/donate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Campaigns", "Donations"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useDonateMutation,
} = crowdfundApi;
