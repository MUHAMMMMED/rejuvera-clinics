 

const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("source") || "",
    utm_campaign: params.get("campaign") || "",
  };
};

export const pushEvent = (eventName, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...getUTMParams(),
    ...data,
  });
};

export const GTMEvents = {
  // ✅ صفحة
  pageView: (pageName) =>
    pushEvent("page_view", {
      page_name: pageName,
    }),

  // ✅ خدمة (view content)
  viewService: (serviceId, serviceName) =>
    pushEvent("view_content", {
      content_type: "service",
      content_id: String(serviceId),
      content_name: serviceName,
    }),

  // ✅ عرض محتوى عام (أي نوع من المحتوى)
  viewContent: (contentId, contentName, contentType = "generic") =>
    pushEvent("view_content", {
      content_type: contentType,
      content_id: String(contentId),
      content_name: contentName,
    }),

  // ✅ جهاز
  viewDevice: (deviceId, deviceName) =>
    pushEvent("view_content", {
      content_type: "device",
      content_id: String(deviceId),
      content_name: deviceName,
    }),

  // ✅ مقال
  viewBlog: (blogId, blogTitle) =>
    pushEvent("view_content", {
      content_type: "blog_post",
      content_id: String(blogId),
      content_name: blogTitle,
    }),

  // ✅ نية حجز
  openBooking: (itemId, itemName, itemType) =>
    pushEvent("initiate_checkout", {
      content_type: itemType === "s" ? "service" : "package",
      content_id: String(itemId),
      content_name: itemName,
    }),

  // ✅ نجاح الحجز
  bookingSuccess: (itemId, itemName, itemType) =>
    pushEvent("lead", {
      content_type: itemType === "s" ? "service" : "package",
      content_id: String(itemId),
      content_name: itemName,
    }),
};