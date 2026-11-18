module.exports = (req, res) => {
  const pw = process.env.ADMIN_PASSWORD;
  const given = (req.body && req.body.password) || '';
  res.status(200).json({ ok: !!pw && given === pw, configured: !!pw });
};
