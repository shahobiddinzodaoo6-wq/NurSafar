import { baseApi } from "../store/baseApi";

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  isCompleted: boolean;
  createdAt: string;
  user: { id: string; name: string };
  _count?: { donations: number };
}

export interface Donation {
  id: string;
  amount: number;
  message?: string;
  createdAt: string;
  donor: { id: string; name: string };
}

export const crowdfundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<Campaign[], void>({
      query: () => "/crowdfund",
      providesTags: ["Campaigns"],
    }),
    getCampaignById: builder.query<Campaign & { donations: Donation[] }, string>({
      query: (id) => `/crowdfund/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Campaigns", id }],
    }),
    createCampaign: builder.mutation<Campaign, { title: string; description?: string; targetAmount: number }>({
      query: (body) => ({ url: "/crowdfund", method: "POST", body }),
      invalidatesTags: ["Campaigns"],
    }),
    donate: builder.mutation<Donation, { campaignId: string; amount: number; message?: string }>({
      query: ({ campaignId, ...body }) => ({
        url: `/crowdfund/${campaignId}/donate`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { campaignId }) => [
        "Campaigns",
        { type: "Campaigns", id: campaignId },
      ],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useDonateMutation,
} = crowdfundApi;
