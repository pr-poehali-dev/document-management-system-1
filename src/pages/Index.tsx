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
}

const mockDocuments: Document[] = [
  { id: '1', number: 'ВХ-2024-0127', title: 'О проведении экспертизы промышленной безопасности', type: 'incoming', date: '2024-01-15', correspondent: 'ПАО "Газпром"', status: 'approval', priority: 'high', assignee: 'Иванов И.И.', department: 'ЦЭКТУ' },
  { id: '2', number: 'ИСХ-2024-0089', title: 'Экспертное заключение №ЭЗ-2024-012', type: 'outgoing', date: '2024-01-14', correspondent: 'ООО "Роснефть"', status: 'approved', priority: 'normal', assignee: 'Петрова М.А.' },
  { id: '3', number: 'ВН-2024-0045', title: 'Служебная записка о кадровых изменениях', type: 'internal', date: '2024-01-13', correspondent: 'Отдел кадров', status: 'processing', priority: 'low', department: 'Администрация' },
  { id: '4', number: 'ВХ-2024-0126', title: 'Запрос на проведение технической экспертизы оборудования', type: 'incoming', date: '2024-01-12', correspondent: 'АО "Сибур"', status: 'new', priority: 'high', assignee: 'Сидоров П.К.' },
  { id: '5', number: 'ИСХ-2024-0088', title: 'Ответ на запрос №127 от 10.01.2024', type: 'outgoing', date: '2024-01-11', correspondent: 'Министерство энергетики', status: 'archived', priority: 'normal' },
];

const menuItems = [
  { icon: 'Inbox', label: 'Входящие документы', id: 'incoming', count: 12 },
  { icon: 'Send', label: 'Исходящие документы', id: 'outgoing', count: 8 },
  { icon: 'FileText', label: 'Внутренние документы', id: 'internal', count: 5 },
  { icon: 'GitPullRequest', label: 'Документы на согласовании', id: 'approval', count: 4 },
  { icon: 'CheckSquare', label: 'Поручения и задачи', id: 'tasks', count: 7 },
  { icon: 'Archive', label: 'Архив документов', id: 'archive', count: 234 },
  { icon: 'BookOpen', label: 'Нормативные документы', id: 'normative', count: 18 },
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

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.correspondent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    
    let matchesSection = true;
    if (selectedSection === 'incoming') matchesSection = doc.type === 'incoming';
    else if (selectedSection === 'outgoing') matchesSection = doc.type === 'outgoing';
    else if (selectedSection === 'internal') matchesSection = doc.type === 'internal';
    else if (selectedSection === 'approval') matchesSection = doc.status === 'approval';
    else if (selectedSection === 'archive') matchesSection = doc.status === 'archived';
    
    return matchesSearch && matchesFilter && matchesSection;
  });

  const getSectionDocuments = () => {
    if (selectedSection === 'incoming') return mockDocuments.filter(d => d.type === 'incoming');
    if (selectedSection === 'outgoing') return mockDocuments.filter(d => d.type === 'outgoing');
    if (selectedSection === 'internal') return mockDocuments.filter(d => d.type === 'internal');
    if (selectedSection === 'approval') return mockDocuments.filter(d => d.status === 'approval');
    if (selectedSection === 'archive') return mockDocuments.filter(d => d.status === 'archived');
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
                  {menuItems.find(item => item.id === selectedSection)?.label}
                </h1>
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
          </header>

          <div className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="animate-fade-in">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Всего документов</CardTitle>
                  <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">в системе</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Новые</CardTitle>
                  <Icon name="Inbox" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                  <p className="text-xs text-muted-foreground">требуют внимания</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">В работе</CardTitle>
                  <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{stats.processing}</div>
                  <p className="text-xs text-muted-foreground">обрабатываются</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
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
                  <Button className="gap-2">
                    <Icon name="Plus" className="h-4 w-4" />
                    Создать документ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <div className="relative flex-1">
                    <Icon name="Search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по номеру, названию, корреспонденту..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
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

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Номер</TableHead>
                        <TableHead>Название документа</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Корреспондент</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Приоритет</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDocument && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl">{selectedDocument.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      <span className="font-medium">{selectedDocument.number}</span> · {new Date(selectedDocument.date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                  <TabsTrigger value="approval">Согласование</TabsTrigger>
                  <TabsTrigger value="attachments">Вложения</TabsTrigger>
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
                      <label className="text-sm font-medium text-muted-foreground">Корреспондент</label>
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
                        <label className="text-sm font-medium text-muted-foreground">Исполнитель</label>
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

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Содержание документа</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedDocument.title}. Документ содержит полную информацию о предмете обращения, включая технические характеристики, требования и сроки выполнения работ. Все необходимые данные извлечены автоматически системой OCR и проверены ответственным специалистом.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="default" className="gap-2">
                      <Icon name="FileSignature" className="h-4 w-4" />
                      Визировать
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Download" className="h-4 w-4" />
                      Скачать PDF
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Printer" className="h-4 w-4" />
                      Печать
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Share2" className="h-4 w-4" />
                      Отправить
                    </Button>
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
                      <div className="flex items-start gap-3 rounded-lg border p-4 bg-green-50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                          <Icon name="Check" className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Начальник отдела экспертизы</p>
                          <p className="text-xs text-muted-foreground">Иванов И.И. · Согласовано 14.01.2024 в 14:30</p>
                          <p className="text-sm text-muted-foreground mt-2">Документ проверен, замечаний нет. Направлен на следующий этап.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-lg border p-4 bg-blue-50 border-blue-200">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <Icon name="Clock" className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Главный специалист ЦЭКТУ</p>
                          <p className="text-xs text-muted-foreground">Петрова М.А. · На рассмотрении</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="default">Согласовать</Button>
                            <Button size="sm" variant="outline">Вернуть на доработку</Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-lg border p-4 opacity-50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                          <Icon name="User" className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Заместитель директора</p>
                          <p className="text-xs text-muted-foreground">Сидоров П.К. · Ожидает</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-lg border p-4 opacity-50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                          <Icon name="Shield" className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Директор (финальная подпись ЭП)</p>
                          <p className="text-xs text-muted-foreground">Александров А.А. · Ожидает</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100">
                        <Icon name="FileText" className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Основной документ.pdf</p>
                        <p className="text-xs text-muted-foreground">2.4 МБ · Загружен 15.01.2024</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="Download" className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100">
                        <Icon name="FileSpreadsheet" className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Приложение_1_Техническая_спецификация.xlsx</p>
                        <p className="text-xs text-muted-foreground">856 КБ · Загружен 15.01.2024</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="Download" className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-green-100">
                        <Icon name="Image" className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Фотография_объекта.jpg</p>
                        <p className="text-xs text-muted-foreground">1.1 МБ · Загружен 15.01.2024</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="Download" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full gap-2">
                    <Icon name="Upload" className="h-4 w-4" />
                    Добавить вложение
                  </Button>
                </TabsContent>

                <TabsContent value="history" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex gap-3 pb-3 border-b">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        ИИ
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Иванов И.И.</p>
                          <span className="text-xs text-muted-foreground">15.01.2024 в 14:30</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Согласовал документ и направил на следующий этап</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pb-3 border-b">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        СИ
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Система</p>
                          <span className="text-xs text-muted-foreground">15.01.2024 в 10:15</span>
                        </div>
                        <p className="text-sm text-muted-foreground">OCR-обработка завершена, реквизиты извлечены автоматически</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pb-3 border-b">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        СИ
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Система</p>
                          <span className="text-xs text-muted-foreground">15.01.2024 в 09:45</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Документ зарегистрирован в системе, присвоен номер ВХ-2024-0127</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        КО
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">Канцелярия</p>
                          <span className="text-xs text-muted-foreground">15.01.2024 в 09:30</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Документ получен, передан на сканирование</p>
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