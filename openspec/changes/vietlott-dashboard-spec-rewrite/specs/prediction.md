# Spec: Prediction System

## Mục Đích

Cho phép người dùng sinh bộ số lottery thông minh dựa trên dữ liệu lịch sử, với 2 thuật toán khác nhau. Hỗ trợ sinh tối đa 5 vé cùng lúc và mua qua SMS.

---

## Page: `/predict` (`predict/page.js`)

### State

| State | Type | Default | Mô tả |
|---|---|---|---|
| `activeTab` | `'Mega645' \| 'Power655'` | `'Mega645'` | Loại xổ số |
| `inputNumber` | `string` | `''` | Chuỗi số hạt giống (formatted) |
| `tickets` | `string[][]` | `[[], [], [], [], []]` | 5 vé, mỗi vé là array 6 số |
| `predictError` | `string` | `''` | Error message |
| `algorithmType` | `'co-occurrence' \| '4-layer'` | `'co-occurrence'` | Thuật toán |
| `isPredicting` | `boolean` | `false` | Loading state |
| `activeTicketIndex` | `0..4` | `0` | Vé đang active để edit |
| `clientId` | `string` | Từ localStorage | ID cá nhân hóa RNG |

### Effects

- Khi `activeTab` đổi: reset tất cả tickets, error, input
- Khi mount: focus vào input field

### Input Format

- Regex: `\D` stripped, nhóm 2 chữ số cách nhau bằng space
- VD: user nhập `0812` → hiển thị `08 12`
- Tối đa 6 chữ số (3 số)

### Validation

- Số trùng: reject
- Số lượng input: 1–3 số (không được ít hơn 1 hoặc nhiều hơn 3)
- Range: `01` đến `MAX_NUMBERS[activeTab]`

---

## Thuật Toán 1: Co-Occurrence (`predictByCoOccurrence`)

**File**: `lib/prediction.js`

**Cơ chế**: Tìm các số thường xuất hiện cùng với số hạt giống trong lịch sử.

### Input

| Param | Type | Mô tả |
|---|---|---|
| `inputArray` | `string[]` | Mảng số hạt giống (zero-padded strings) |
| `targetCount` | `number` | Số cần tìm thêm = `6 - inputArray.length` |
| `activeTab` | `string` | Loại xổ số |
| `data` | `object[]` | Lịch sử xổ số |
| `excludeNumbers` | `string[]` | Số cần loại trừ |
| `offsetIndex` | `number` | Offset để tạo vé khác nhau (0..4 cho 5 vé) |

### Logic

1. Filter lịch sử để chỉ lấy kỳ có chứa ít nhất 1 số trong `inputArray`
2. Đếm tần suất xuất hiện của các số khác (loại trừ `inputArray` và `excludeNumbers`)
3. Sort by frequency desc
4. Với `offsetIndex`: lấy slice `[skip : skip+targetCount]` (`skip = offsetIndex * targetCount`)
5. Fallback: nếu không đủ số, lấy top frequency từ toàn bộ lịch sử

### Output

```js
{ error: string, numbers: string[] }
```

---

## Thuật Toán 2: 4-Layer Filtering (`predictBy4LayerFiltering`)

**File**: `lib/prediction.js`

**Cơ chế**: Monte Carlo simulation với 4 ràng buộc thống kê.

### Input

| Param | Type | Mô tả |
|---|---|---|
| `inputArray` | `string[]` | Số hạt giống |
| `targetCount` | `number` | Số cần tìm |
| `activeTab` | `string` | Loại xổ số |
| `data` | `object[]` | Lịch sử |
| `clientId` | `string` | ID cá nhân hóa RNG seed |
| `excludeNumbers` | `string[]` | Loại trừ |
| `attemptOffset` | `number` | Offset cho seed để re-roll |

### RNG

- Thuật toán **mulberry32** (PRNG nhanh, deterministic)
- Seed = `baseSeedNum * 100000 + latestDrawId + abs(clientHash) + attemptOffset`
- `clientHash` tính từ `clientId` string (djb2-like hash)

### 4 Layers (Filters)

**Nguồn pool**:
- Hot numbers: top 15 theo tần suất 50 kỳ gần nhất
- Cold numbers: bottom 15 theo tần suất 50 kỳ gần nhất
- Last draw: 6 số của kỳ gần nhất

**Building a candidate set**:
1. Start với `inputArray`
2. Add 1 số random từ `lastDraw` (Layer: Recent number)
3. Add 1 số random từ `coldNumbers` (Layer: Cold number)
4. Fill còn lại từ `hotNumbers` (Layer: Hot numbers)
5. Fill nếu thiếu bằng random từ range (safety fallback)

**Scoring (penalties)**:
| Ràng buộc | Penalty |
|---|---|
| Sum ngoài range `[MIN_SUM, MAX_SUM]` | +10 |
| Chẵn/lẻ extreme (0,1,5,6 chẵn) | +5 |
| Thấp/cao extreme (0,1,5,6 số thấp) | +5 |
| Chuỗi liên tiếp > 2 | +8 |
| Khoảng cách lớn < 2 | +4 |

**Expected ranges**:
| Tab | MIN_SUM | MAX_SUM | HIGH_THRESHOLD |
|---|---|---|---|
| Mega645 | 110 | 160 | 22 |
| Power655 | 130 | 180 | 27 |

**Iteration**:
- Max 1,000,000 iterations
- Trả về sớm nếu penalties = 0
- Sau 500,000 iter: trả về nếu penalties ≤ 4
- Cuối cùng: trả về bestSet (ít penalty nhất)

---

## Ticket Management

### 5 Vé (A–E)

- State: `tickets = [[], [], [], [], []]`
- Mỗi vé là array 6 số (zero-padded strings), sorted ascending

### Sinh vé

**"Tìm" (single)**: Sinh 1 vé tại `activeTicketIndex`
**"Tạo 5 Vé" (all)**: Sinh cả 5 vé với `offsetIndex` = 0..4

### Xóa vé

- Nút Trash2 trên mỗi vé có số → clear về `[]`

### Edit thủ công (Grid)

- Grid hiển thị tất cả số (01–45 hoặc 01–55)
- Click số: toggle add/remove khỏi vé active
- Tối đa 6 số mỗi vé
- Số đang selected màu blue (<= 40) / red (> 40)
- Số trong `inputNumber` → hiển thị ring amber

---

## SMS Purchase

### Button: "Mua Vé Ngay Qua SMS"

- Disable nếu không có vé nào đủ 6 số
- Format cú pháp:
  ```
  645 K1 S x1 x2 x3 x4 x5 x6 S y1 y2...   (Mega 6/45)
  655 K1 S x1 x2 x3 x4 x5 x6...             (Power 6/55)
  ```
- Gửi đến: `sms:9969`
- Sử dụng `window.location.href = 'sms:9969?body=<encoded>'`

---

## Page Layout

```
[Sticky Top Nav]
  ← Dashboard | 🪄 "Dự Đoán" | [6/45] [6/55]

[Scrollable Content, pb-28]
  [Algorithm Selector: 🎯 Cơ Bản | 🧠 4 Lớp]
  [Input] [Tìm] [Tạo 5 Vé]
  [Error]
  [Tickets A–E list]
  [Grid: 01–45 or 01–55]

[Fixed Bottom Footer]
  [Send icon] Mua Vé Ngay Qua SMS
  "Cú pháp sẽ được sinh tự động gửi đến 9969"
```
