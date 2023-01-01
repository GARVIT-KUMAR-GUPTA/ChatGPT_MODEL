import bot from "./assets/bot.svg"
import user from "./assets/user.svg"
const form=document.querySelector('form')
const chat_container=document.querySelector('#chat_container')
let loadInterval;
function loader(element) {
    element.textContent="";
    loadInterval= setInterval(()=>{
        element.textContent+=".";
        if(element.textContent==='...'){
            element.textContent="";
        }
    },300)
}
function typeText(element,text){
    let index=0;
    console.log(text[2]);
    const interval=setInterval(()=>{
        if(index<text.length){
            element.innerHTML+=text[index];
            index++;
        }else{
            clearInterval(interval)
        }
    },30)
}
function chatStripe(isAi,value,uniqueID){
    
    return `<div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
            <div class="profile">
                <img src=${isAi?bot:user}>
            </div>
            <div class="message" id=${uniqueID}>${value}
            </div>
        </div>
    </div>`
}
function generateUniqueID(){
    const timeStamp=Date.now();
    const randomNumber=Math.random();
    const hexaDecimalString =randomNumber.toString(16);
    return `id-${timeStamp}-${hexaDecimalString}`
}
const handleSubmit=async(e)=>{
    e.preventDefault();
    const data=new FormData(form);
    form.reset();
    chat_container.innerHTML+=chatStripe(false,data.get('prompt'))
    let uniqueID=generateUniqueID();
    console.log(uniqueID);
    chat_container.innerHTML+=chatStripe(true,"hello",uniqueID);
    let mssgDiv=document.getElementById(uniqueID);
    chat_container.scrollTop = chat_container.scrollHeight;
    console.log(mssgDiv);
    loader(mssgDiv)
    const response=await fetch('http://localhost:5000/',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
                prompt: data.get('prompt')
            })
    })
    clearInterval(loadInterval)
    mssgDiv.innerHTML = " "
    console.log({response});
    if(response.ok){
        const data=await response.json();
        const parsedData=data.bot.trim();
        console.log(parsedData);
        typeText(mssgDiv,parsedData)
        
    }else{
        const err= await response.text();
        mssgDiv.innerHTML+="Something Went Wrong";
        alert(err);
    }
    //console.log(response.json());
}
form.addEventListener('submit',handleSubmit);
form.addEventListener('keypress',(e)=>{
    if(e.key==='Enter'){
        handleSubmit(e);
    }
})