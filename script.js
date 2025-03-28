document.addEventListener('DOMContentLoaded',()=>{

const booksDiv = document.getElementById('books');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageNo = document.getElementById('pageNo');
const searchInput = document.getElementById('searchInput');
const viewSelect  = document.getElementById('viewSelect');
const sortSelect = document.getElementById('sortSelect');


let page = 1;
limit = 10;
let arr = [];



getBooks();

async function getBooks(page=1){
    const url = `https://api.freeapi.app/api/v1/public/books?page=${page}`;
const options = {method: 'GET', headers: {accept: 'application/json'}};

try {
  const response = await fetch(url, options);
  const res = await response.json();
  console.log(res.data.data);//array of objects(each book)
   arr = res.data.data
  displayBooks(arr);
  return arr;
} catch (error) {
  console.error(error);
  return [];
}
}

async function displayBooks(arr){

    booksDiv.innerHTML = "";

    arr.forEach(e=>{
      const title = e.volumeInfo.title;
      const author = e.volumeInfo.authors[0];
      const publisher = e.volumeInfo.publisher;
      const publishedDate = e.volumeInfo.publishedDate;
      const thumbnailUrl = e.volumeInfo.imageLinks.thumbnail;
      const moreInfoUrl = e.volumeInfo.infoLink;  
      
      const book = document.createElement('div');
       book.className = "book-card";
       
       book.style.padding = "15px";
       book.style.background = "rgba(0, 0, 0, 0.6)";
       book.style.color = "white";
       book.style.minHeight = "400px";  
       book.style.width = "250px";  
       book.style.border = "2px solid white";
       book.style.borderRadius = "8px";
       book.style.display = "flex";
       book.style.flexDirection="column";
       book.style.alignItems="center";
       book.style.justifyContent="center";
     
      
       


      book.innerHTML = `
<img class="book-thumbnail" src="${thumbnailUrl}" alt="${title}" style="height: 200px; width: 160px ">
<div class="book-details" 
     style="display: flex; flex-direction: column; gap: 12px; padding: 15px; background: rgba(0, 0, 0, 0.6); border-radius: 8px;">
    <h3 class="book-title" style="font-size: 24px; font-weight: bold; color: white;">${title}</h3>
    <p class="book-author" style="font-size: 16px; color: white;"><strong style="font-weight: bold;" >Author:</strong> ${author}</p>
    <p class="book-publisher" style="font-size: 16px; color: white;"><strong style="font-weight: bold;" >Publisher:</strong> ${publisher}</p>
    <p class="book-date" style="font-size: 16px; color: white;"><strong style="font-weight: bold;" >Published:</strong> ${publishedDate}</p>
    <a class="more-info-btn" href="${moreInfoUrl}" target="_blank" 
       style="display: inline-block; margin-top: 10px; padding: 8px 15px; background-color: #D2B48C; color: white; 
              text-decoration: none; font-weight: bold; border-radius: 5px; transition: 0.3s ease-in-out;">
       More Info
    </a>
</div>

    `;
    

       
        

      booksDiv.appendChild(book);
    })
    
}

nextBtn.addEventListener('click',()=>{
    if(page<limit){
        page++;
        getBooks(page);
        pageNo.innerText = page;
    }else{
        page = 1;
        getBooks(page);
        pageNo.innerText = page;
    }
})

prevBtn.addEventListener('click',()=>{
    if(page>1){
        page--;
        getBooks(page);
        pageNo.innerText = page;
    }else{
        page = limit;
        getBooks(page);
        pageNo.innerText = page;
    }
})

searchInput.addEventListener('input',async()=>{
const name = searchInput.value.toLowerCase();
const allBooks = await getBooks(page);
if (name === "") {
displayBooks(allBooks);
 return;
}
const filteredBooks =  allBooks.filter(book=>{
    const title = book.volumeInfo.title?.toLowerCase() || "";
    const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ").toLowerCase() : "";
    return title.includes(name) || authors.includes(name);
})
displayBooks(filteredBooks);
})





sortSelect.addEventListener('change', () => {
    const selectedValue = sortSelect.value;

    if (selectedValue === 'title') {
        arr.sort((a, b) => {
            const titleA = (a.volumeInfo.title || "").trim().toLowerCase().replace(/\s+/g, " ");
            const titleB = (b.volumeInfo.title || "").trim().toLowerCase().replace(/\s+/g, " ");
            return titleA.localeCompare(titleB);
        });
    } else if (selectedValue === 'release-date') {
        arr.sort((a, b) => {
            const dateA = new Date(a.volumeInfo.publishedDate || "1970-01-01");
            const dateB = new Date(b.volumeInfo.publishedDate || "1970-01-01");
            return dateA - dateB;
        });
    }

    displayBooks(arr);
});

viewSelect.addEventListener('change',()=>{
    const selectedValue = viewSelect.value.toLowerCase();

    if(selectedValue==='list'){
       
        booksDiv.style.display = 'flex';
        booksDiv.style.flexDirection = 'column';
        booksDiv.style.gap = '20px';
  
    }else if(selectedValue==='grid'){
        booksDiv.style.display = 'grid';
        booksDiv.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 2fr))";
         booksDiv.style.gap = '40px';
       
        
    }

})

})