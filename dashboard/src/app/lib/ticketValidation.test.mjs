import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSeeds, isValidTicket, uniqueTicketKey} from './ticketValidation.mjs';

for (const maxNum of [45,55]) {
 test(`valid seeds and ticket range ${maxNum}`, () => {
   assert.equal(validateSeeds(['01','12'],maxNum,4),'');
   assert.ok(isValidTicket(['01','12','21','30','35',String(maxNum).padStart(2,'0')], ['01','12'],maxNum));
 });
 test(`reject malformed and duplicate numbers ${maxNum}`, () => {
   assert.match(validateSeeds(['01','01'],maxNum,4),/trùng/);
   assert.match(validateSeeds(['00'],maxNum,5),/01/);
   assert.match(validateSeeds(['99'],maxNum,5),/01/);
   assert.ok(validateSeeds(['01'],maxNum,4));
   assert.equal(isValidTicket(['01','01','02','03','04','05'],['01'],maxNum),false);
   assert.equal(isValidTicket(['01','02','03','04','05','99'],['01'],maxNum),false);
 });
}
test('ticket key does not depend on display order',()=>{
 assert.equal(uniqueTicketKey(['03','01','02']),uniqueTicketKey(['02','03','01']));
});
