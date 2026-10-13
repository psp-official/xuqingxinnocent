# XUQINGXINNOCENT Self-hosted API (Render starter)

ဒီ project က Render ပေါ်မှာ ကိုယ်ပိုင် API စတင်တည်ဆောက်ဖို့ starter ဖြစ်ပါတယ်။ လက်ရှိ Extension ရဲ့ obfuscated `src/api.js` ထဲက endpoint/response protocol ကို အပြည့်အဝဖော်ထုတ်ပြီး အစားထိုးပြီးသား မဟုတ်ပါ။ ထို့ကြောင့် ဒီ API ကို Extension နဲ့ ချိတ်ပြီးသားလို့ မယူဆပါနဲ့။

## Render တင်နည်း
1. ဒီ folder ထဲက ဖိုင်အားလုံးကို GitHub repository အသစ်တစ်ခုထဲ upload လုပ်ပါ။ ဥပမာ `xuqingxinnocent-api`။
2. Render Dashboard → New + → Blueprint သို့မဟုတ် Web Service ကို ရွေးပြီး repository ချိတ်ပါ။ Blueprint သုံးရင် `render.yaml` ကို ဖတ်ပါမယ်။
3. Deploy ပြီးရင် Render ပေးတဲ့ URL ကို ဖွင့်ပါ။ `/health` က `{"ok":true,...}` ပြရပါမယ်။
4. `/api/version` နဲ့ `/api/checkup` ကိုလည်း စမ်းပါ။

## Remote Quality Upload Script
မူရင်း ZIP ထဲမှာ `src/load.js` က `SenzeAPI.fetchPatchScript(...)` ကို ခေါ်ပေမဲ့ မူရင်း script အကြောင်းအရာကို ZIP ထဲမှာ မတွေ့ရပါ။ `api.js` လည်း obfuscated ဖြစ်ပါတယ်။ မူရင်း script source ကို မရမချင်း `/api/patch` က 503 ပြန်ပေးတာဟာ ရည်ရွယ်ချက်ရှိရှိ လုပ်ထားတာပါ—မှားယွင်းတဲ့ script ကို မပို့မိစေရန်ပါ။

မူရင်း script source ကို ရရှိပြီး ခွင့်ပြုချက်ရှိကြောင်း သေချာပြီး စစ်ဆေးပြီးမှ `patches/quality-upload.js` အဖြစ် ထည့်ပါ။ ပြီးမှ extension API ရဲ့ လက်ရှိ request/response format နဲ့ ကိုက်ညီအောင် route, authentication, payload တွေကို ပြင်ဆင်ရပါမယ်။

## လုံခြုံရေး
- ဒီ starter မှာ remote block/disable feature ကို မဖွင့်ထားပါ။
- Extension မှာ `eval`/`new Function` ဖြင့် remote JavaScript ကို execute လုပ်နိုင်တဲ့ code ပါတာကြောင့် server ကပေးမယ့် script ကို အရင်စစ်ဆေးပါ။
- Render URL ကို `src/api.js` မှာ အစားထိုးရုံနဲ့ မလုံလောက်ပါ။ Obfuscated API ရဲ့ path, headers, body, response schema ကို ပြန်လည်အကောင်အထည်ဖော်ဖို့လိုပါတယ်။
