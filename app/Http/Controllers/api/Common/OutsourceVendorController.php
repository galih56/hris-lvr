<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\OutsourceVendorRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\OutsourceVendor\StoreOutsourceVendorRequest;
use App\Http\Requests\Common\OutsourceVendor\UpdateOutsourceVendorRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\OutsourceVendorResource;

class OutsourceVendorController extends Controller
{
    private OutsourceVendorRepositoryInterface $outsourceVendorRepository;
    
    public function __construct(OutsourceVendorRepositoryInterface $outsourceVendorRepository)
    {
        $this->outsourceVendorRepository = $outsourceVendorRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->outsourceVendorRepository->get($filters, $perPage, []);

        if($perPage){
            $outsource_vendors = [
                'data' => OutsourceVendorResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($outsource_vendors,200);
        }else{
            $outsource_vendors = OutsourceVendorResource::collection($data);
            return ApiResponse::sendResponse($outsource_vendors,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOutsourceVendorRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $outsource_vendor = $this->outsourceVendorRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($outsource_vendor,'OutsourceVendor Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $outsource_vendor = $this->outsourceVendorRepository->find($id);

        return ApiResponse::sendResponse(new OutsourceVendorResource($outsource_vendor),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateOutsourceVendorRequest $request)
    {
        DB::beginTransaction();
        try{
            $outsource_vendor = $this->outsourceVendorRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $outsource_vendor , 'OutsourceVendor Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->outsourceVendorRepository->delete($id);
        
        return ApiResponse::sendResponse('OutsourceVendor Delete Successful','',204);
    }

}
