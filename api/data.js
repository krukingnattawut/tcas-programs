const FALL = require('../programs.json');
function parseCSV(t){const r=[];let row=[],c='',q=false;for(let i=0;i<t.length;i++){const h=t[i];
 if(q){if(h=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=h}
 else if(h=='"')q=true;else if(h==','){row.push(c);c=''}
 else if(h=='\n'||h=='\r'){if(h=='\r'&&t[i+1]=='\n')i++;row.push(c);r.push(row);row=[];c=''}else c+=h}
 if(c||row.length){row.push(c);r.push(row)}return r}
const n=v=>v===''||v==null?null:Number(v);
module.exports = async (req, res) => {
  let programs = FALL.programs, src = 'bundled', err = '';
  if (process.env.SHEET_CSV_URL) {
    try {
      const t = await (await fetch(process.env.SHEET_CSV_URL)).text();
      const rows = parseCSV(t).filter(r => r.length > 3 && r[0]);
      const H = rows.shift().map(x => x.trim());
      programs = rows.map(r => { const o = {}; H.forEach((h, i) => o[h] = (r[i] || '').trim());
        const w = {}; o.weights.split(';').forEach(x => { const [k, v] = x.split(':'); if (k && v) w[k.trim()] = Number(v) });
        return { id: o.id, uni: o.uni, fac: o.fac, name: o.name, seat70: n(o.seat70), gpaxMin: n(o.gpaxMin), req: o.req, w,
          s69: { seat: n(o.seat69), apps: n(o.apps69), pass: n(o.pass69), max: n(o.max69), min: n(o.min69) } } });
      src = 'sheet';
    } catch (e) { err = String(e); src = 'bundled (อ่าน Sheet ไม่ได้)'; programs = FALL.programs; }
  }
  res.setHeader('Cache-Control', 's-maxage=20');
  res.status(200).json({ programs, src, err, formUrl: process.env.FORM_URL || '', sheetUrl: process.env.SHEET_EDIT_URL || '' });
};
