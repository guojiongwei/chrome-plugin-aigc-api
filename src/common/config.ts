export const templateMap = {
  typescript: `
    import request from '@/utils/request'

    \/** 接口描述-参数 */
    export interface IApiDescParams {
      /** 分页数量 */
      pageSize: number
    }

    /** 接口描述-响应 */
    export interface IApiDescResonse {}

    /** 接口描述-接口 */
    export const methodApiDescApi = (params: IApiDescParams) => {
      return request.get<IApiDescResonse>('/xxx', params)
    }
  `,
}
