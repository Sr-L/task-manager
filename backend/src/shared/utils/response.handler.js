export function successResponse(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function messageResponse(res, message, status = 200) {
  return res.status(status).json({ success: true, message });
}
