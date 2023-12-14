const fStep = 201.5;
const cards_famaly={
    diamonds:0,
    clubs:fStep,
    hearts:fStep*2,
    spades:fStep*3
}
const nStep = 144;
const card_name={
    '_2':0,
    '_3':nStep,
    '_4':(nStep*2),
    '_5':(nStep*3),
    '_6':(nStep*4),
    '_7':(nStep*5),
    '_8':(nStep*6),
    '_9':(nStep*7),
   '_10':(nStep*8),
  'jack':(nStep*9),
 'queen':(nStep*10),
  'king':(nStep*11),
   'ace':(nStep*12)
}
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
class Card{
    constructor(rawCount, cardCount, onClick){
        const cCount = rawCount * cardCount;
        const temp = [];
        let i;
        this._cards=[];
        this.onClick = onClick;
        if (cCount % 2){
            console.error(`Получилось ${cCount}карт. Количество должно быть чётным`);
        }
        const cHalf = cCount/2;
        for (i=0;i<cHalf;i++){
            this._cards.push(this._generateCard());
        }
        for (;i<cCount;i++){
            let index;
            do{
                index = getRandomInRange(0,cHalf-1)
            }while(temp.indexOf(index)>-1);
            temp.push(index);
            this._cards.push(this._cards[index]);
        }
    }
    
    _cardClick(element){
        $(element)
            .addClass('openned')
            .css({
                'background-position-x':$(element).attr('data-card-name'),
                'background-position-y':$(element).attr('data-card-famaly')
            });
        const oppend = $('.openned');
        if (oppend.length === 2){
            const first = $(oppend.get(0));
            const second = $(oppend.get(1));
            if ((first.attr('data-card-name') === second.attr('data-card-name'))&&
                first.attr('data-card-famaly') === second.attr('data-card-famaly')){
                oppend.removeClass('openned game_card_shirt').removeAttr('style');
            }else{
                setTimeout(()=>oppend.removeClass('openned').removeAttr('style'),500);
            }
        }
        if (typeof(this.onClick)){
            this.onClick.call(this);
        }
    }
    _generateCard(){
        return {
            famaly:this._generateCardFamaly(),
            name:this._generateCardName()
        };
    }
    _generateCardFamaly(){
        return Object.keys(cards_famaly)[getRandomInRange(0, Object.keys(cards_famaly).length-1)];
    }
    _generateCardName(){
        return Object.keys(card_name)[getRandomInRange(0, Object.keys(card_name).length-1)];
    }
    render(cardFamaly){
        const card = this._cards.pop();
        return $('<div>')
            .addClass('game_card game_card_shirt')
            .attr({
                'data-card-name':`${-card_name[card.name]}px`,
                'data-card-famaly':`${-cards_famaly[card.famaly]}px`
            })
            .click((e)=>this._cardClick(e.target));
    }
}
class CardRaw{
    static renderRow(cardCount, card){
        const raw = $('<div>').addClass('game__row');
        let prev='';
        for (let i=0;i<cardCount;i++){
            raw.append(
                $('<div>')
                    .addClass('game__cell')
                    .append(
                        card.render()
                    )
            );
        }
        return raw;
    }
}
function renderTime(timeInformer,startTime){
    const currentD = new Date();
    const milliseconds = (currentD.getTime() - startTime.getTime());
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
    const formattedTime = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0")
    ].join(":");  
    timeInformer.text((formattedTime));
}
function renderMoves(moveInformer, movesCount){
    moveInformer.text(movesCount);
}
$(document).ready(()=>{
    // console.log("ready");
    const game = $('.game');
    const timeInformer = $('.time__informer>.info__block-content');
    const moveInformer = $('.moves__informer>.info__block-content');
    const startTime =new Date();
    let movesCount = 0 ;
    let interVal;
    const card = new Card(Object.keys(cards_famaly).length, 7, ()=>{
        renderMoves(moveInformer, ++movesCount);
        if (!$('.game_card_shirt').length){
            if (interVal){
                clearInterval(interVal);
                interVal=0;
            }
            $('.bunner').removeClass('hidden');
        }
    });
    renderTime( timeInformer, startTime );
    renderMoves(moveInformer, movesCount);
    // timeInformer.text(startTime.toLocaleTimeString())
    game.children().remove();
    // console.log(Object.keys(card_name).length);
    // console.log(Object.keys(card_name));
    for (let i = 0;i<Object.keys(cards_famaly).length;i++){
        game.append(
            CardRaw.renderRow(7, card)
        );
    }
    interVal = setInterval(()=>renderTime( timeInformer, startTime ),1000);
});