window.JARVIS_CONFIG = {
  supabaseUrl: "https://lgfhywtphebtzntidhof.supabase.co",
  supabasePublishableKey: "sb_publishable_dM6YhGhb3nqajlKMFEN2Iw_cKZ9Nbvs",
  edgeFunction: "chat"
};

// The main app expects window.supabase before its startup code runs.
// Force-load the UMD build synchronously during HTML parsing when needed.
if (!window.supabase && document?.write) {
  document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>');
}
