import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@/lib/api/common";
import { getServerSession } from "next-auth";
import { nextauthOptions } from "@/lib/nextauthOptions";
import { CommonResponse } from "@/types/responses";
import { JobStatus } from "@/types/types";
import { mainClient } from "@/lib/api";

export type EmployeeJob = {
  employee_id: string;
  job_id: string;
  created_at: string;
  job: {
    id: string;
    description: string;
    address: string;
    status: JobStatus;
    type: string;
    amount: number;
    scheduled_start: string;
    created_at: string;
    updated_at: string;
    customer: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      address: string;
      type: string;
      mobile_number: string;
      avatar_url: string;
      lead_source: string;
      firebase_token: null | string;
      verified: boolean;
      created_at: string;
      updated_at: string;
    };
  };
};

export type EmployeeJobsResponseData = {
  count: number;
  employeeJobs: EmployeeJob[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommonResponse<EmployeeJobsResponseData>>
) {
  const session = await getServerSession(req, res, nextauthOptions);

  const jwt = session?.user?.accessToken;

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid ID parameter" });
    }

    await get<CommonResponse<EmployeeJobsResponseData>>({
      client: mainClient,
      url: `/api/v1/job/employee?id=${id}`,
      config: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
      onResponse: ({ data }) => {
        if (data) {
          return res.status(200).json({ success: true, data: data.data });
        }
      },
      onError: ({ response }) => {
        return res.status(response?.status || 500).json({
          success: false,
          message: response?.statusText,
        });
      },
    });
  } catch (e) {
    console.log(e);
  }
}
