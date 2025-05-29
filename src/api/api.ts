import { Lang } from "../constants/lang";

type RunPayload = {
  language: Lang;
  code: string;
};

type SuccessResponse = {
  status: "success" | "error";
  output: string;
};

function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, ms);
  });
}

export const api = {
  async runCode(payload: RunPayload, error: boolean): Promise<SuccessResponse> {
    await delay(500);

    if (error) {
      return Promise.reject({
        status: "error",
        error: "SyntaxError: Unexpected token",
      });
    }

    if (payload.language === Lang.GO) {
      return {
        status: "success",
        output: "Hello, 世界",
      };
    }

    try {
      return {
        status: "success",
        output: eval(payload.code),
      };
    } catch (error) {
      return Promise.reject({
        status: "error",
        error: (error as Error).message,
      });
    }
  },
};
