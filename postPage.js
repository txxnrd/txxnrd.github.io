// postPage.js
function showBlogPost(title, summary, date, content) {
  const postPage = document.createElement("div");
  postPage.className = "blog-post-page";
  postPage.innerHTML = `
      	<link rel="stylesheet" type="text/css" href="style.css">

      <div class="blog-post">
        <h2>${title}</h2>
        <small>${date}</small>
        <div class="blog-content">${content}</div>
        <a href="/blog.html" class="back-button">뒤로 가기</a>
      </div>
    `;
  document.body.innerHTML = "";
  document.body.appendChild(postPage);
}
