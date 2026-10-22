import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTicketSet, normalizeSeeds, secureInt, summarizeTickets } from './ticketEngine.mjs';
import { isValidTicket, uniqueTicketKey } from './ticketValidation.mjs';

test('input validation allows zero favorites and rejects duplicates/range overflow', () => {
  assert.deepEqual(normalizeSeeds('', 'Mega645'), {seeds:[],error:''});
  assert.deepEqual(normalizeSeeds('8 12', 'Mega645'), {seeds:['08','12'],error:''});
  assert.match(normalizeSeeds('01 01', 'Mega645').error,/trùng/);
  assert.ok(normalizeSeeds('46', 'Mega645').error);
  assert.equal(normalizeSeeds('55', 'Power655').error,'');
  assert.ok(normalizeSeeds('1 2 3 4', 'Power655').error);
  assert.ok(normalizeSeeds('00', 'Power655').error);
});
test('secure draw returns integers within range', () => {
  for(let i=0;i<250;i++) {const n = secureInt(55);assert.ok(Number.isInteger(n) && n>=0 && n<55);}
});
for (const game of ['Mega645','Power655']) {
  const max=game==='Mega645'?45:55;
  for(const mode of ['coverage','random']) {
    test(game+' '+mode+' generates five legal, unique six-number tickets', () => {
      for(let round=0;round<30;round++) {
        const seeds = ['01','08','12'];
        const tickets=generateTicketSet({game,mode,seeds});
        assert.equal(tickets.length,5);
        assert.equal(new Set(tickets.map(uniqueTicketKey)).size,5);
        for(const ticket of tickets) assert.ok(isValidTicket(ticket,seeds,max),ticket.join(','));
      }
    });
  }
  test(game+' coverage minimizes repeated nonfavorite numbers',()=>{
    const tickets=generateTicketSet({game,mode:'coverage',seeds:['01','08']});
    const all=new Set(tickets.flat());
    assert.equal(all.size,22); // 2 shared favorites + 5 * 4 distinct numbers
    assert.equal(summarizeTickets(tickets,game).distinct,22);
  });
  test(game+' supports no favorites (quick pick)',()=>{
    const tickets=generateTicketSet({game,mode:'coverage'});
    assert.equal(new Set(tickets.flat()).size,30);
  });
  test(game+' single reroll does not duplicate other tickets',()=>{
    const old=generateTicketSet({game,seeds:['03']});
    const next=generateTicketSet({game,seeds:['03'],count:1,existing:old.slice(1)});
    assert.ok(!old.slice(1).some(t=>uniqueTicketKey(t)===uniqueTicketKey(next[0])));
  });
}
