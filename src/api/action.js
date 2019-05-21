import request from '@/utils/request'

export function getLogs() {
  return request({
    url: '/admin/actionLogs',
    method: 'get'
  })
}
