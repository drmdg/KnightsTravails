
const chessboard = document.getElementsByClassName('chessboard')[0];
const modal= document.getElementsByClassName('modal')[0];

let i=7;
let j=0;
let partida=[];
let destino=[];

    for(;i>=0;i--){
        for(;j<8;j++){
            let aux=document.createElement('dib');
            aux.classList.add('cell');
            aux.setAttribute('id',`${j}${i}`);
            aux.addEventListener('click',(e)=>{
                fazjogada(e);
            });

            chessboard.appendChild(aux);
        }
        j=0;
    }

function fazjogada(e){
    if(partida.length==0){
        partida.push(e.target.id[0]);console.log(e.target.id[0]);
        partida.push(e.target.id[1]);console.log(e.target.id[1]);
    }else{
        destino.push(e.target.id[0]);console.log(e.target.id[0]);
        destino.push(e.target.id[1]);console.log(e.target.id[1]);

        let moves=knigth(+partida[0],+partida[1],+destino[0],+destino[1]);
        modal.innerHTML =   `<button>X</button>
                            <div>Foram necessários ${moves} movimentos!</div>`
        modal.style.cssText="display:flex";

    }



}





function knigth(xinicio,yinicio,x,y){

    let steps = [[2,-1],[1,-2],[-1,-2],[-2,-1],[-1,2],[1,2],[2,1],[-2,1]]
    let seen=[[xinicio,yinicio]];

    let q= [0,[xinicio,yinicio]]

    while(q.length>0){
        let moves=q.shift();
        let coords=q.shift();
        if(coords[0]==x && coords[1]==y){
            return moves;  
        }
            for (s of steps){
                let next= [coords[0]+s[0],coords[1]+s[1]];
                console.log(next);
                if (!seen.includes(next)&&(next[0]>0 && next[1]>0)&&(next[0]<8 && next[1]<8)){
                    q.push(moves+1);
                    q.push(next);
                    seen.push(next);
                }
            }
        

       


    }

}
