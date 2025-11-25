import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Icon from '@/components/ui/icon';

interface Document {
  id: string;
  number: string;
  title: string;
  type: 'incoming' | 'outgoing' | 'internal';
  date: string;
  correspondent: string;
  status: 'new' | 'processing' | 'approval' | 'approved' | 'archived';
  priority: 'high' | 'normal' | 'low';
  assignee?: string;
  department?: string;
  content?: string;
  subtype?: string;
}

const mockDocuments: Document[] = [
  { id: '1', number: 'ВХ-2024-0127', title: 'О проведении экспертизы промышленной безопасности', type: 'incoming', date: '2024-01-15', correspondent: 'ПАО "Газпром"', status: 'approval', priority: 'high', assignee: 'Иванов И.И.', department: 'ЦЭКТУ', content: 'Прошу провести экспертизу промышленной безопасности опасных производственных объектов в соответствии с требованиями ФЗ-116. Объем работ включает проверку технического состояния оборудования, системы контроля и автоматики.' },
  { id: '2', number: 'ИСХ-2024-0089', title: 'Экспертное заключение №ЭЗ-2024-012', type: 'outgoing', date: '2024-01-14', correspondent: 'ООО "Роснефть"', status: 'approved', priority: 'normal', assignee: 'Петрова М.А.', content: 'На основании проведенной экспертизы установлено, что объект соответствует требованиям промышленной безопасности. Выдано положительное заключение сроком на 3 года.' },
  { id: '3', number: 'ВН-2024-0045', title: 'Служебная записка о кадровых изменениях', type: 'internal', date: '2024-01-13', correspondent: 'Отдел кадров', status: 'processing', priority: 'low', department: 'Администрация', content: 'Довожу до сведения об изменениях в штатном расписании отдела экспертизы. Планируется расширение штата на 2 единицы.' },
  { id: '4', number: 'ВХ-2024-0126', title: 'Запрос на проведение технической экспертизы оборудования', type: 'incoming', date: '2024-01-12', correspondent: 'АО "Сибур"', status: 'new', priority: 'high', assignee: 'Сидоров П.К.', content: 'Необходимо провести техническую экспертизу технологического оборудования. Срок выполнения - 20 рабочих дней.' },
  { id: '5', number: 'ИСХ-2024-0088', title: 'Ответ на запрос №127 от 10.01.2024', type: 'outgoing', date: '2024-01-11', correspondent: 'Министерство энергетики', status: 'archived', priority: 'normal', content: 'В ответ на запрос сообщаем, что экспертиза проведена в полном объеме. Прилагаем копии документов.' },
  { id: '6', number: 'НД-2024-001', title: 'Положение об экспертизе промышленной безопасности', type: 'internal', date: '2024-01-10', correspondent: 'Юридический отдел', status: 'approved', priority: 'normal', subtype: 'position', content: 'Положение регламентирует порядок проведения экспертизы, определяет права и обязанности экспертов, устанавливает требования к отчетной документации.' },
  { id: '7', number: 'НД-2024-002', title: 'Приказ №15 о назначении комиссии', type: 'internal', date: '2024-01-09', correspondent: 'Руководство', status: 'approved', priority: 'high', subtype: 'order', content: 'ПРИКАЗЫВАЮ: Назначить комиссию по проверке соблюдения требований промышленной безопасности в составе: Иванов И.И. (председатель), Петрова М.А., Сидоров П.К.' },
  { id: '8', number: 'НД-2024-003', title: 'Протокол совещания от 08.01.2024', type: 'internal', date: '2024-01-08', correspondent: 'Дирекция', status: 'approved', priority: 'normal', subtype: 'protocol', content: 'Присутствовали: Иванов И.И., Петрова М.А., Сидоров П.К. Повестка: рассмотрение плана работ на I квартал 2024 года. РЕШИЛИ: Утвердить план проведения экспертиз.' },
];

interface MenuItem {
  icon: string;
  label: string;
  id: string;
  count: number;
  submenu?: { label: string; id: string; count: number }[];
}

const menuItems: MenuItem[] = [
  { icon: 'Inbox', label: 'Входящие документы', id: 'incoming', count: 2 },
  { icon: 'Send', label: 'Исходящие документы', id: 'outgoing', count: 2 },
  { icon: 'FileText', label: 'Внутренние документы', id: 'internal', count: 4 },
  { icon: 'GitPullRequest', label: 'Документы на согласовании', id: 'approval', count: 1 },
  { icon: 'CheckSquare', label: 'Исполнение документов', id: 'execution', count: 3 },
  { icon: 'CheckSquare', label: 'Поручения и задачи', id: 'tasks', count: 7 },
  { icon: 'Archive', label: 'Архив документов', id: 'archive', count: 1 },
  { 
    icon: 'BookOpen', 
    label: 'Нормативные документы', 
    id: 'normative', 
    count: 3,
    submenu: [
      { label: 'Положения', id: 'normative-position', count: 1 },
      { label: 'Приказы', id: 'normative-order', count: 1 },
      { label: 'Протоколы', id: 'normative-protocol', count: 1 },
    ]
  },
  { icon: 'FolderOpen', label: 'Дела и контейнеры', id: 'folders', count: 15 },
  { icon: 'BarChart3', label: 'Отчёты и аналитика', id: 'reports', count: 0 },
];

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'Новый', variant: 'default' },
  processing: { label: 'В работе', variant: 'secondary' },
  approval: { label: 'На согласовании', variant: 'outline' },
  approved: { label: 'Утверждён', variant: 'default' },
  archived: { label: 'В архиве', variant: 'secondary' },
};

const priorityLabels: Record<string, { label: string; color: string }> = {
  high: { label: 'Высокий', color: 'text-red-600' },
  normal: { label: 'Средний', color: 'text-blue-600' },
  low: { label: 'Низкий', color: 'text-gray-600' },
};

export default function Index() {
  const [selectedSection, setSelectedSection] = useState('incoming');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterCorrespondent, setFilterCorrespondent] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentView, setCurrentView] = useState<'main' | 'list'>('list');

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.correspondent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    
    const matchesDateFrom = !filterDateFrom || new Date(doc.date) >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || new Date(doc.date) <= new Date(filterDateTo);
    const matchesAssignee = !filterAssignee || doc.assignee?.toLowerCase().includes(filterAssignee.toLowerCase());
    const matchesCorrespondent = !filterCorrespondent || doc.correspondent.toLowerCase().includes(filterCorrespondent.toLowerCase());
    
    let matchesSection = true;
    if (selectedSection === 'incoming') matchesSection = doc.type === 'incoming';
    else if (selectedSection === 'outgoing') matchesSection = doc.type === 'outgoing';
    else if (selectedSection === 'internal') matchesSection = doc.type === 'internal';
    else if (selectedSection === 'approval') matchesSection = doc.status === 'approval';
    else if (selectedSection === 'archive') matchesSection = doc.status === 'archived';
    else if (selectedSection === 'execution') matchesSection = doc.status === 'processing';
    else if (selectedSection === 'normative') matchesSection = doc.subtype !== undefined;
    else if (selectedSection === 'normative-position') matchesSection = doc.subtype === 'position';
    else if (selectedSection === 'normative-order') matchesSection = doc.subtype === 'order';
    else if (selectedSection === 'normative-protocol') matchesSection = doc.subtype === 'protocol';
    
    return matchesSearch && matchesFilter && matchesSection && matchesDateFrom && matchesDateTo && matchesAssignee && matchesCorrespondent;
  });

  const getSectionDocuments = () => {
    if (selectedSection === 'incoming') return mockDocuments.filter(d => d.type === 'incoming');
    if (selectedSection === 'outgoing') return mockDocuments.filter(d => d.type === 'outgoing');
    if (selectedSection === 'internal') return mockDocuments.filter(d => d.type === 'internal');
    if (selectedSection === 'approval') return mockDocuments.filter(d => d.status === 'approval');
    if (selectedSection === 'archive') return mockDocuments.filter(d => d.status === 'archived');
    if (selectedSection === 'execution') return mockDocuments.filter(d => d.status === 'processing');
    if (selectedSection === 'normative') return mockDocuments.filter(d => d.subtype !== undefined);
    if (selectedSection === 'normative-position') return mockDocuments.filter(d => d.subtype === 'position');
    if (selectedSection === 'normative-order') return mockDocuments.filter(d => d.subtype === 'order');
    if (selectedSection === 'normative-protocol') return mockDocuments.filter(d => d.subtype === 'protocol');
    return mockDocuments;
  };

  const sectionDocs = getSectionDocuments();
  
  const stats = {
    total: sectionDocs.length,
    new: sectionDocs.filter(d => d.status === 'new').length,
    processing: sectionDocs.filter(d => d.status === 'processing').length,
    approval: sectionDocs.filter(d => d.status === 'approval').length,
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarContent>
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Icon name="FileText" className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-sidebar-foreground">СЭД Система</h2>
                  <p className="text-xs text-sidebar-foreground/70">Документооборот</p>
                </div>
              </div>
            </div>

            <Separator className="bg-sidebar-border" />

            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70">Разделы документов</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    item.submenu ? (
                      <Collapsible key={item.id}>
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="w-full justify-between">
                              <div className="flex items-center gap-3">
                                <Icon name={item.icon as any} className="h-4 w-4" />
                                <span className="text-sm">{item.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.count > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.count}
                                  </Badge>
                                )}
                                <Icon name="ChevronDown" className="h-4 w-4" />
                              </div>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenu className="ml-4 mt-1 border-l pl-2">
                              {item.submenu.map((subitem) => (
                                <SidebarMenuItem key={subitem.id}>
                                  <SidebarMenuButton
                                    onClick={() => setSelectedSection(subitem.id)}
                                    isActive={selectedSection === subitem.id}
                                    className="w-full justify-between"
                                  >
                                    <span className="text-sm">{subitem.label}</span>
                                    {subitem.count > 0 && (
                                      <Badge variant="secondary" className="text-xs">
                                        {subitem.count}
                                      </Badge>
                                    )}
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))}
                            </SidebarMenu>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => setSelectedSection(item.id)}
                          isActive={selectedSection === item.id}
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Icon name={item.icon as any} className="h-4 w-4" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          {item.count > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.count}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {menuItems.find(item => item.id === selectedSection)?.label || 
                   menuItems.flatMap(item => item.submenu || []).find(sub => sub.id === selectedSection)?.label}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={currentView === 'main' ? 'default' : 'outline'} 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setCurrentView('main')}
                >
                  <Icon name="Home" className="h-4 w-4" />
                  Главная
                </Button>
                <Button 
                  variant="default"
                  size="sm" 
                  className="gap-2"
                  onClick={() => setSelectedDocument({ 
                    id: 'new', 
                    number: '', 
                    title: '', 
                    type: 'incoming', 
                    date: new Date().toISOString().split('T')[0], 
                    correspondent: '', 
                    status: 'new', 
                    priority: 'normal' 
                  })}
                >
                  <Icon name="Plus" className="h-4 w-4" />
                  Создать карточку
                </Button>
                <div className="flex items-center gap-1 rounded-md border">
                  <Button 
                    variant={viewMode === 'table' ? 'default' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setViewMode('table')}
                  >
                    <Icon name="List" className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'cards' ? 'default' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setViewMode('cards')}
                  >
                    <Icon name="LayoutGrid" className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="icon">
                  <Icon name="Bell" className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="Settings" className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="User" className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {currentView === 'main' ? (
            <div className="p-6 space-y-6">
              <div className="text-center py-20">
                <Icon name="FileText" className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-3xl font-bold mb-2">Добро пожаловать в СЭД Систему</h2>
                <p className="text-muted-foreground mb-6">Управление документооборотом организации</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setCurrentView('list')} className="gap-2">
                    <Icon name="FileText" className="h-4 w-4" />
                    Перейти к документам
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Icon name="BarChart3" className="h-4 w-4" />
                    Посмотреть отчёты
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('all')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего документов</CardTitle>
                    <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">в разделе</p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }} onClick={() => setFilterStatus('new')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Новые</CardTitle>
                    <Icon name="Inbox" className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                    <p className="text-xs text-muted-foreground">требуют внимания</p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.2s' }} onClick={() => setFilterStatus('processing')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">В работе</CardTitle>
                    <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{stats.processing}</div>
                    <p className="text-xs text-muted-foreground">обрабатываются</p>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in cursor-pointer hover:shadow-md transition-shadow" style={{ animationDelay: '0.3s' }} onClick={() => setFilterStatus('approval')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">На согласовании</CardTitle>
                    <Icon name="GitPullRequest" className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.approval}</div>
                    <p className="text-xs text-muted-foreground">ожидают визы</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Список документов</CardTitle>
                      <CardDescription>Управление документами и реквизитами</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Icon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Поиск по номеру, названию, корреспонденту..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      >
                        <Icon name="Filter" className="h-4 w-4" />
                      </Button>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все статусы</SelectItem>
                          <SelectItem value="new">Новые</SelectItem>
                          <SelectItem value="processing">В работе</SelectItem>
                          <SelectItem value="approval">На согласовании</SelectItem>
                          <SelectItem value="approved">Утверждённые</SelectItem>
                          <SelectItem value="archived">Архив</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {showAdvancedSearch && (
                      <div className="grid gap-4 md:grid-cols-4 p-4 border rounded-lg bg-muted/50">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Дата от</label>
                          <Input
                            type="date"
                            value={filterDateFrom}
                            onChange={(e) => setFilterDateFrom(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Дата до</label>
                          <Input
                            type="date"
                            value={filterDateTo}
                            onChange={(e) => setFilterDateTo(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Исполнитель</label>
                          <Input
                            placeholder="Введите ФИО"
                            value={filterAssignee}
                            onChange={(e) => setFilterAssignee(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Контрагент</label>
                          <Input
                            placeholder="Название организации"
                            value={filterCorrespondent}
                            onChange={(e) => setFilterCorrespondent(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {viewMode === 'table' ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Номер</TableHead>
                            <TableHead>Название документа</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Корреспондент</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead>Исполнитель</TableHead>
                            <TableHead>Приоритет</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDocuments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                Документы не найдены
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredDocuments.map((doc) => (
                              <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedDocument(doc)}>
                                <TableCell className="font-medium">{doc.number}</TableCell>
                                <TableCell className="max-w-[300px] truncate">{doc.title}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{doc.correspondent}</TableCell>
                                <TableCell className="text-sm">{new Date(doc.date).toLocaleDateString('ru-RU')}</TableCell>
                                <TableCell className="text-sm">{doc.assignee || '—'}</TableCell>
                                <TableCell>
                                  <span className={`text-xs font-medium ${priorityLabels[doc.priority].color}`}>
                                    {priorityLabels[doc.priority].label}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={statusLabels[doc.status].variant}>
                                    {statusLabels[doc.status].label}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedDocument(doc); }}>
                                    <Icon name="Eye" className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredDocuments.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                          Документы не найдены
                        </div>
                      ) : (
                        filteredDocuments.map((doc) => (
                          <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedDocument(doc)}>
                            <CardHeader>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <CardTitle className="text-base">{doc.title}</CardTitle>
                                  <CardDescription className="mt-1">{doc.number}</CardDescription>
                                </div>
                                <Badge variant={statusLabels[doc.status].variant}>
                                  {statusLabels[doc.status].label}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Дата:</span>
                                  <span className="font-medium">{new Date(doc.date).toLocaleDateString('ru-RU')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Корреспондент:</span>
                                  <span className="font-medium truncate ml-2">{doc.correspondent}</span>
                                </div>
                                {doc.assignee && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Исполнитель:</span>
                                    <span className="font-medium">{doc.assignee}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {doc.type === 'incoming' ? 'Входящий' : doc.type === 'outgoing' ? 'Исходящий' : 'Внутренний'}
                                  </Badge>
                                  <span className={`text-xs font-medium ${priorityLabels[doc.priority].color}`}>
                                    {priorityLabels[doc.priority].label}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedDocument.title || 'Новый документ'}</DialogTitle>
                    <DialogDescription className="mt-2">
                      <span className="font-medium">{selectedDocument.number || 'Не присвоен'}</span> · {new Date(selectedDocument.date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </DialogDescription>
                  </div>
                  <Badge variant={statusLabels[selectedDocument.status].variant} className="ml-4">
                    {statusLabels[selectedDocument.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Реквизиты</TabsTrigger>
                  <TabsTrigger value="content">Содержание</TabsTrigger>
                  <TabsTrigger value="approval">Согласование</TabsTrigger>
                  <TabsTrigger value="history">История</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Тип документа</label>
                      <p className="text-sm font-medium">
                        {selectedDocument.type === 'incoming' ? 'Входящий документ' : selectedDocument.type === 'outgoing' ? 'Исходящий документ' : 'Внутренний документ'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Регистрационный номер</label>
                      <p className="text-sm font-medium">{selectedDocument.number}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Корреспондент / Получатель</label>
                      <p className="text-sm font-medium">{selectedDocument.correspondent}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Дата регистрации</label>
                      <p className="text-sm font-medium">{new Date(selectedDocument.date).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Приоритет</label>
                      <p className={`text-sm font-medium ${priorityLabels[selectedDocument.priority].color}`}>
                        {priorityLabels[selectedDocument.priority].label}
                      </p>
                    </div>
                    {selectedDocument.assignee && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Сотрудник-исполнитель</label>
                        <p className="text-sm font-medium">{selectedDocument.assignee}</p>
                      </div>
                    )}
                    {selectedDocument.department && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Подразделение</label>
                        <p className="text-sm font-medium">{selectedDocument.department}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="default" className="gap-2">
                      <Icon name="Save" className="h-4 w-4" />
                      Сохранить
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Download" className="h-4 w-4" />
                      Скачать PDF
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Printer" className="h-4 w-4" />
                      Печать
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Содержание документа</h4>
                      <div className="rounded-lg border bg-muted/50 p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedDocument.content || 'Содержание документа не заполнено. Документ содержит полную информацию о предмете обращения, включая технические характеристики, требования и сроки выполнения работ.'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-3">Вложения</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                          <Icon name="FileText" className="h-8 w-8 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Скан оригинала.pdf</p>
                            <p className="text-xs text-muted-foreground">2.4 МБ · Загружен 15.01.2024</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Icon name="Download" className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                          <Icon name="FileSpreadsheet" className="h-8 w-8 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Приложение 1.xlsx</p>
                            <p className="text-xs text-muted-foreground">156 КБ · Загружен 15.01.2024</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Icon name="Download" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="approval" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Маршрут согласования</h4>
                      <Badge variant="outline">Этап 2 из 4</Badge>
                    </div>

                    <Progress value={50} className="h-2" />

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                          <Icon name="Check" className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Руководитель отдела</p>
                          <p className="text-xs text-muted-foreground">Иванов И.И. · Согласовано 16.01.2024 в 10:30</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                          <Icon name="Clock" className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Главный инженер</p>
                          <p className="text-xs text-muted-foreground">Петрова М.А. · На рассмотрении</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                          <Icon name="User" className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Юридический отдел</p>
                          <p className="text-xs text-muted-foreground">Сидоров П.К. · Ожидает</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                          <Icon name="UserCheck" className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Генеральный директор</p>
                          <p className="text-xs text-muted-foreground">Ожидает</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                          <Icon name="FileText" className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-px flex-1 bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">Документ зарегистрирован</p>
                        <p className="text-xs text-muted-foreground">15.01.2024 в 09:15 · Система</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                          <Icon name="Send" className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-px flex-1 bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">Отправлен на согласование</p>
                        <p className="text-xs text-muted-foreground">15.01.2024 в 14:20 · Иванов И.И.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                          <Icon name="Check" className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-px flex-1 bg-border mt-2" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">Согласовано руководителем отдела</p>
                        <p className="text-xs text-muted-foreground">16.01.2024 в 10:30 · Иванов И.И.</p>
                        <p className="text-xs text-muted-foreground mt-1">Комментарий: Согласовано без замечаний</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                          <Icon name="Clock" className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">На рассмотрении у главного инженера</p>
                        <p className="text-xs text-muted-foreground">16.01.2024 в 11:00 · Петрова М.А.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
