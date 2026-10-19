import {ingest,build} from './cli.mjs';

const source=(publisher,url,publishedDate,publishedAt=null,sourceKind='press')=>({publisher,url,publishedDate,...(publishedAt?{publishedAt}:{}),accessedAt:null,readLevel:'body',sourceKind});
const item=(classification,eventKey,eventDate,title,summary,interpretation,sources)=>({classification,eventKey,eventDate,title,summary,interpretation,sources});

const items=[
 item('A','metro-housing-starts-202610','2026-10-16','수도권 주택 착공 9만9,000가구…공급 회복 여부가 핵심','정부의 첫 주택공급 정례브리핑을 인용한 보도에 따르면 10월 둘째 주까지 수도권에서 9만9,000가구 이상이 착공됐고, 연말 착공 물량은 21만8,000~23만5,000가구로 전망됐습니다. 공공주택·신축매입·민간정비사업이 주요 구성 항목입니다.','착공 증가는 건설물량 회복의 선행 신호지만 발표 물량이 실제 공정과 투자로 이어지는지 확인해야 합니다. 월별 착공실적, 공공·민간 비중, 중단·지연 여부를 후속 추적할 필요가 있습니다.',[
  source('건설타임즈','https://www.constimes.co.kr/news/articleView.html?idxno=314235','2026-10-16')]),
 item('A','seoul-housing-market-202610','2026-10-18','서울 주택시장 거래 감소…공급 부족 위험은 지속','보도에 따르면 서울 아파트 거래량은 5월 8,900건에서 8월 4,600건으로 감소했고 매매 매물은 연초보다 약 30% 증가했습니다. 올해 수도권 아파트 입주물량은 최근 10년 평균보다 약 42% 부족할 것으로 전망됐습니다.','수요 위축에 따른 가격 안정 신호와 중기적인 입주물량 부족 위험이 동시에 나타납니다. 신규 분양성과와 민간 주택사업 착수 여부를 함께 살펴야 합니다.',[
  source('건설타임즈','https://www.constimes.co.kr/news/articleView.html?idxno=314238','2026-10-18','2026-10-18T19:35:00+09:00')]),
 item('A','lh-urban-complex-5032-20261016','2026-10-16','서울 도심복합사업 3개 지구, 5,032가구 공급절차 착수','LH가 신길4구역, 녹번동근린공원, 송중동 주민센터 인근 등 3개 도심 공공주택 복합지구의 사업계획 수립과 설계·시공 통합공모 등 후속 절차에 들어갔습니다.','공급계획 발표에서 사업계획과 시공사 선정 단계로 이동한 사례입니다. 사업계획 승인과 실제 착공까지 남은 절차가 많아 진행단계별 추적이 필요합니다.',[
  source('뉴스1','https://www.news1.kr/realestate/general/6322043','2026-10-16','2026-10-16T09:15:00+09:00')]),
 item('A','yeouido-sibeom-builder-selection-20261016','2026-10-16','삼성물산, 여의도 시범아파트 2조2,685억원 재건축 수주','삼성물산이 여의도 시범아파트 재건축 시공사로 선정됐습니다. 사업계획상 기존 1,584가구를 최고 59층, 2,491가구 규모로 재건축하며 총공사비는 2조2,685억원입니다.','대형 건설사의 정비사업 수주 확대 사례입니다. 시공사 선정은 착공·매출 인식과 다르므로 관리처분계획, 이주·철거 일정과 공사비 조정 가능성을 함께 확인해야 합니다.',[
  source('매일경제','https://www.mk.co.kr/news/realestate/12179010','2026-10-18','2026-10-18T17:21:00+09:00')]),
 item('A','us-construction-input-prices-202609','2026-09-30','미국 건설 투입가격, 9월 전년 동월 대비 11.2% 상승','Construction Dive는 연료비와 관세 영향을 받는 주요 자재가격 상승으로 미국의 9월 건설 투입가격이 전년 동월 대비 11.2% 올랐다고 보도했습니다.','미국에서 사업을 수행하거나 기자재를 조달하는 국내 건설기업의 원가 위험입니다. 계약가격 조정 조항, 기자재 조달조건, 현지 원가상승 대응 여부를 살펴야 합니다.',[
  source('Construction Dive','https://www.constructiondive.com/news/construction-prices-jumped-annually-september/833217/','2026-10-16')]),

 item('B','employment-construction-2026-09',null,'건설업 취업자 2년간 13만명 이상 감소','9월 건설업 취업자는 192만6,000명으로 전년 동월보다 4만8,000명 감소했고, 보도에 따르면 2년간 줄어든 건설업 일자리는 13만명 이상입니다. 건설기성이 증가로 전환됐음에도 고용 감소가 이어졌습니다.','경기침체가 일용직에서 현장관리·기술직 고용으로 확산되는지 확인해야 합니다. 종사상 지위·연령·지역별 감소와 건설기성 회복이 고용으로 연결되는 시차가 주요 관찰 대상입니다.',[
  source('대한경제','https://www.dnews.co.kr/uhtml/view.jsp?idxno=202610181316049930018','2026-10-19','2026-10-19T06:00:31+09:00')]),
 item('B','cw-rest-facility-support-20261019','2026-10-19','100억원 미만 현장 휴게시설 개선비 최대 500만원 지원','건설근로자공제회가 총공사금액 100억원 미만 현장을 대상으로 휴게시설 개선비를 지원합니다. 지원대상 사업장은 퇴직공제 가입사업장의 86.4%인 4만6,994곳이며 현장당 최대 500만원을 지원합니다.','냉난방기·냉장고·간이침대 등 기본 휴게시설 개선 사업입니다. 전체 대상 규모에 비해 총예산이 2억원으로 제한돼 실제 선정 현장 수와 지역 분포를 확인해야 합니다.',[
  source('고용노동부·건설근로자공제회','https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=20111','2026-10-19',null,'official'),
  source('연합뉴스','https://www.yna.co.kr/view/AKR20261016142600530','2026-10-19','2026-10-19T06:00:00+09:00'),
  source('뉴시스','https://www.newsis.com/view/NISX20261016_0003829695','2026-10-19','2026-10-19T06:00:00+09:00')]),
 item('B','booyoung-safety-workshop-202610','2026-10-16','건설현장 안전관리자의 현장 대응역량 강화 움직임','부영그룹이 전국 현장 안전·보건관리자를 대상으로 재해 예방대책, 안전점검 사례와 현장 애로사항을 공유하는 하반기 워크숍을 실시했습니다.','개별 기업의 교육 사례이므로 산업 전체 변화로 일반화할 수 없습니다. 안전관리자의 실무역량과 본사·현장 간 정보공유가 주요 과제로 다뤄진 사례로 봐야 합니다.',[
  source('건설타임즈','https://www.constimes.co.kr/news/articleView.html?idxno=314232','2026-10-16','2026-10-16T15:31:00+09:00'),
  source('뉴스핌','https://m.newspim.com/news/view/20261016001259','2026-10-16','2026-10-16T16:34:00+09:00')]),

 item('C','private-infrastructure-investment-forum-20261016','2026-10-16','정부, 5년간 100조원 규모 민간투자사업 발굴 방향 제시','정부는 연평균 민간투자 규모를 약 14조원에서 20조원으로 확대하고 향후 5년간 총 100조원 규모의 신규 사업을 발굴하는 방향을 제시했습니다. AI 데이터센터, 전력망, 반도체 클러스터 용수·교통시설 등이 신규 영역으로 언급됐습니다.','현재 단계는 개별 사업 확정이나 실제 투자 집행이 아니라 정책방향과 발굴 목표입니다. 사업목록, 민간제안, 적격성조사, 실시협약 등 후속 절차를 구분해 추적해야 합니다.',[
  source('대한경제','https://www.dnews.co.kr/uhtml/view.jsp?idxno=202610171153030120964','2026-10-19','2026-10-19T06:00:36+09:00')]),
 item('C','illegal-subcontracting-inspection-20261019','2026-10-19','불법하도급 단속, 경상권 민간 건설현장으로 확대','국토교통부가 10월 19일부터 11월 13일까지 경상권 민간 건설현장 75곳을 집중 점검합니다. 불법하도급과 임금·장비대금 체불이 점검대상입니다.','건설사업자에게 하도급 계약, 직접시공, 대금지급과 현장 인력관리 자료의 정합성이 중요해졌습니다. 점검 후 적발 유형과 처분 결과를 후속 확인해야 합니다.',[
  source('대한경제','https://www.dnews.co.kr/m_home/view_dnews.jsp?idxno=202610181326430080020','2026-10-18','2026-10-18T13:27:06+09:00')]),
 item('C','gtx-b-cheonghak-station-20261016','2026-10-16','GTX-B 청학사거리 추가정거장, 중앙투자심사 통과','GTX-B 인천대입구역과 인천시청역 사이 추가정거장 사업이 행정안전부 중앙투자심사를 통과했습니다. 총사업비 약 2,694억원은 인천시가 부담하며 2034년 개통을 목표로 후속 절차가 추진됩니다.','심사 통과는 착공이나 개통 확정과 동일한 단계가 아닙니다. 시의회 동의, 예산 확보, 민간사업시행자와의 위·수탁협약이 남아 있습니다.',[
  source('아이뉴스24','https://inews24.com/view/wnrd/2015775','2026-10-16','2026-10-16T13:12:00+09:00'),
  source('뉴스에디션','https://newsedition.kr/news/view.php?no=926','2026-10-18','2026-10-18T09:48:00+09:00')]),
 item('C','power-grid-project-delays-20261019','2026-10-19','송변전사업 지연, 첨단산업 인프라의 병목으로 부상','국회 제출자료를 인용한 보도에 따르면 제7~10차 전력수급기본계획의 주요 송변전사업 중 중복을 제외한 31건이 준공 목표를 넘겼고 초과기간 합계는 121년 2개월로 집계됐습니다.','전력망 지연은 AI 데이터센터·반도체 관련 건설투자 일정에 영향을 줄 수 있습니다. 합산 지연기간은 개별 사업의 초과기간을 더한 값이므로 평균 지연기간과 구분해야 합니다.',[
  source('연합뉴스','https://www.yna.co.kr/view/AKR20261018047300003','2026-10-19','2026-10-19T06:47:00+09:00')]),

 item('D','kict-sk-ai-datacenter-mou-20261016','2026-10-16','건설연·SK이노베이션, AI 데이터센터 기술 공동개발','한국건설기술연구원과 SK이노베이션이 AI 데이터센터 구축·운영 기술의 공동연구와 실증을 추진합니다. 폐열관리, 모듈러 데이터센터, 수열 활용, 화재안전, 무중단 운영 등이 협력 의제입니다.','현재는 연구·실증 협력 단계입니다. 실제 기술개발 과제 선정, 테스트베드 구축과 상용화 여부를 후속 확인해야 합니다.',[
  source('건설타임즈','https://www.constimes.co.kr/news/articleView.html?idxno=314229','2026-10-16','2026-10-16T14:29:00+09:00')]),
 item('D','eunmin-bim-iso19650-202610','2026-09-29','건축·인테리어 기업, BIM 정보관리 국제표준 인증 취득','은민에스엔디가 BIM 기반 정보관리 국제표준 ISO 19650 인증을 취득했다고 발표했습니다. 3D 스캔 현장데이터와 BIM 모델을 비교해 시공오차를 관리하는 방식이 소개됐습니다.','인증 취득은 기업의 정보관리체계가 심사기준을 충족했다는 의미입니다. 생산성 향상이나 공사비 절감 효과까지 입증한 것은 아니므로 실제 적용 프로젝트와 정량적 성과를 별도로 확인해야 합니다.',[
  source('대한경제','https://www.dnews.co.kr/uhtml/view.jsp?idxno=202610160922233100836','2026-10-19','2026-10-19T06:00:48+09:00')]),
 item('D','iso-structural-design-meeting-20261016','2026-10-16','구조설계 국제표준 논의에 국내 연구기관 참여 확대','한국건설기술연구원이 ISO 구조설계 기술위원회 연차회의를 개최했습니다. 구조신뢰성, 풍하중, 적설하중, 내진설계와 확률 기반 구조안전 평가의 국제표준 제·개정이 논의됐습니다.','국내 기술의 국제표준 반영 가능성과 함께 국내 설계기준·인증·해외 엔지니어링 사업에 미치는 영향을 장기적으로 살필 필요가 있습니다.',[
  source('건설타임즈','https://www.constimes.co.kr/news/articleView.html?idxno=314223','2026-10-16','2026-10-16T12:49:00+09:00')]),
 item('D','gangneung-its-world-congress-20261019','2026-10-19','강릉 ITS 세계총회 개막…AI 기반 교통인프라 논의','10월 19일부터 23일까지 강릉에서 ITS 세계총회가 열립니다. 193개 학술세션과 428개 전시부스가 운영되며 AI 기반 ITS, 기술 실증과 국내기업 해외진출 지원이 주요 의제입니다.','도로·교통시설의 디지털 전환, 센서·관제시스템, 통신 인프라와 운영기술 통합이 핵심입니다. 행사 발표와 실제 발주·실증사업을 구분해 정리해야 합니다.',[
  source('대한경제','https://www.dnews.co.kr/uhtml/view.jsp?idxno=202610181329582460021','2026-10-18','2026-10-18T13:30:02+09:00')])
];

const names={A:'건설산업 일반',B:'건설기술인·인력',C:'제도·정책',D:'건설기술·AI'};
const highlights=[
 '주택 착공과 대형 정비사업 수주는 회복 신호지만 거래 위축·입주물량 부족·국내외 공사비 위험을 함께 봐야 합니다.',
 '건설고용 감소가 이어지는 가운데 현장 휴게시설과 안전관리 역량 강화 조치의 실제 적용 범위를 확인해야 합니다.',
 '민간투자·교통사업 확대와 전력망·인허가 병목이 공존하며 BIM·AI·ITS 활동은 실증과 발주 단계로 구분해 추적해야 합니다.'
];
const markdown=['# 건설산업 일일 이슈 브리핑 · 2026-10-19','','> 검토 전 초안 · 2026-10-16 09:00 ~ 2026-10-19 09:00 KST','','## 오늘의 종합 관찰',...highlights.map(x=>'- '+x)];
for(const id of Object.keys(names)){markdown.push('',`## ${id} ${names[id]}`);for(const x of items.filter(v=>v.classification===id)){markdown.push('',`### ${x.title}`,'',x.summary,'',`왜 중요한가: ${x.interpretation}`,'',...x.sources.map(s=>`- [${s.publisher} 원문](${s.url}) · 게시 ${s.publishedAt||s.publishedDate}`));}}

const report={
 kind:'daily',date:'2026-10-19',cycle:'2026-10-19',generatedAt:'2026-10-19T16:42:00+09:00',window:{from:'2026-10-16T09:00:00+09:00',to:'2026-10-19T09:00:00+09:00'},
 title:'건설산업 일일 이슈 브리핑 · 2026-10-19',highlights,items,
 limitations:['오전 9시 이후 게시물은 다음 회차 대상으로 남겼습니다.','접근 제한 매체는 기사 부재로 판단하지 않았습니다.','기업 발표·언론 인용 수치는 원자료 검증 범위를 각 항목에 표시했습니다.'],
 domainCoverage:{A:{status:'checked',note:'경기·주택·기업·원가·해외건설 관련 보도를 확인'},B:{status:'checked',note:'고용·근로환경·안전관리 인력 관련 보도를 확인'},C:{status:'checked',note:'민간투자·하도급·교통·전력망 정책 보도를 확인'},D:{status:'checked',note:'AI 데이터센터·BIM·국제표준·ITS 보도를 확인'}},
 coverage:[
  {sourceId:'대한경제',status:'checked',note:'개별 기사 본문 5건 확인',url:'https://www.dnews.co.kr/'},{sourceId:'건설타임즈',status:'partial',note:'개별 기사 본문 5건 확인, 전체 지면 조사로 보지 않음',url:'https://www.constimes.co.kr/'},{sourceId:'연합뉴스',status:'partial',note:'개별 기사 본문 2건 확인, 일부 검색 접근 제한',url:'https://www.yna.co.kr/'},{sourceId:'매일경제',status:'checked',note:'정비사업 기사 본문 확인',url:'https://www.mk.co.kr/'},{sourceId:'뉴스1',status:'checked',note:'도심복합사업 기사 본문 확인',url:'https://www.news1.kr/'},{sourceId:'뉴시스',status:'checked',note:'휴게시설 지원 기사 본문 확인',url:'https://www.newsis.com/'},{sourceId:'뉴스핌',status:'checked',note:'안전관리 워크숍 기사 본문 확인',url:'https://www.newspim.com/'},{sourceId:'아이뉴스24',status:'checked',note:'GTX-B 기사 본문 확인',url:'https://inews24.com/'},{sourceId:'뉴스에디션',status:'checked',note:'GTX-B 관련 기사 본문 확인',url:'https://newsedition.kr/'},{sourceId:'Construction Dive',status:'partial',note:'미국 투입가격 기사 본문 확인, 원기관 자료 접근 제한',url:'https://www.constructiondive.com/'},{sourceId:'고용노동부',status:'checked',note:'휴게시설 지원 보도자료 확인',url:'https://www.moel.go.kr/'},{sourceId:'국토일보',status:'blocked',note:'관련 기사 검색 발견, 개별 본문 접근 실패',url:'https://www.ikld.kr/'},{sourceId:'한국건설신문',status:'blocked',note:'홈페이지 접근 오류로 개별 본문 미확보',url:'https://www.conslove.co.kr/'},{sourceId:'대한전문건설신문',status:'blocked',note:'홈페이지 접근 오류로 개별 본문 미확보',url:'https://www.koscaj.com/'}
 ],markdown:markdown.join('\n')
};

console.log(JSON.stringify(ingest(report)));
console.log(JSON.stringify(build()));
