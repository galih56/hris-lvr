<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\TaxStatusRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\TaxStatus\StoreTaxStatusRequest;
use App\Http\Requests\Common\TaxStatus\UpdateTaxStatusRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\TaxStatusResource;

class TaxStatusController extends Controller
{
    private TaxStatusRepositoryInterface $taxStatusRepository;
    
    public function __construct(TaxStatusRepositoryInterface $taxStatusRepository)
    {
        $this->taxStatusRepository = $taxStatusRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->taxStatusRepository->get($filters, $perPage, []);

        if($perPage){
            $employment_statuses = [
                'data' => TaxStatusResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($employment_statuses,200);
        }else{
            $employment_statuses = TaxStatusResource::collection($data);
            return ApiResponse::sendResponse($employment_statuses,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaxStatusRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $taxStatus = $this->taxStatusRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($taxStatus,'TaxStatus Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $taxStatus = $this->taxStatusRepository->find($id);

        return ApiResponse::sendResponse(new TaxStatusResource($taxStatus),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateTaxStatusRequest $request)
    {
        DB::beginTransaction();
        try{
            $taxStatus = $this->taxStatusRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $taxStatus , 'TaxStatus Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->taxStatusRepository->delete($id);
        
        return ApiResponse::sendResponse('TaxStatus Delete Successful','',204);
    }

    public function checkTaxStatusCode($search)
    {
        $taxStatusData = $this->taxStatusRepository->checkTaxStatusCode($search);
    
        if ($taxStatusData['status'] === 'no_taxStatus') {
            return ApiResponse::sendResponse(null, $taxStatusData['message'], 'error', 404);
        }
    
        return ApiResponse::sendResponse($taxStatusData['data'], $taxStatusData['message'], 'success', 200);
    }
}
